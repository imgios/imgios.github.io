---
title: "Building an homelab — Part II"
date: 2025-02-27
draft: true
tags: ["homelab", "docker", "kubernetes"]
keywords: ["homelab", "docker", "kubernetes", "k3s", "raspberry pi"]
summary: "Building an homelab with spare hardware and Raspberry Pis can be funny as well as educational. This post covers a Kubernetes homelab built by using two Raspberry Pi 4 nodes."
---

Well, here I am. A cool tower consisting of two Raspberry Pis running Ubuntu Server 22.04, a switch and nothing else. The last post covers why I am building this simple homelab and how I set up both the network and the SBC boards. To recap, my network consists of a modem with DHCP enabled, configured to assign IPs from the 192.168.1.2/24 subnet. Even though the modem is allowed to assign any IP from the whole subnet, the SBC boards always get the same IP because I have configured their MAC address in the modem to give them a fixed one. I know this configuration isn't feasible with multiple machines, but I have other plans for the future if this homelab doesn't get killed.

With that little recap, we are ready to dive into the cluster creation.

## Kubernetes on stage

As I said in the previous post, I'm going to build a low-power Kubernetes cluster to host some services like Home Assistant, Gitea, and some monitoring tools like Prometheus and Grafana. There are many Kubernetes distributions on the web, each built with a specific purpose in mind, and for my homelab I'll be using [K3s](https://k3s.io/). K3s is a lightweight certified Kubernetes distro, built for IoT and Edge computing, optimized for ARM.

Both Raspberry Pis will be used to build the cluster, where the `pi01` will be the control-plane, while the `pi02` will just be a worker. Both will handle the workload, but the main difference is that the `pi01` as control-plane will also run the following core Kubernetes components:

- `kube-apiserver`: Exposes the Kubernetes HTTP API
- `etcd`: Key-value store for all API server data
- `kube-scheduler`: Assign each pod to a node
- `kube-controller-manager`: Runs controllers that implements Kubernetes API behavior

Meanwhile, the `pi02` as worker will run the following Kubernetes components:

- `kubelet`: Ensures that Pods are running correctly
- `containerd`: Container runtime responsible for running containers

Installing K3s on both devices is fairly straightforward. The first node to be deployed is the pi01 as control-plane:

```shell
imgios@pi01:~$ curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644 --token r4nd0mt0k3nh0m3l4b --bind-address 192.168.1.211
```

This command basically installs the k3s agent on the node, writes all the necessary config files, saves the kubeconfig with the permissions set to `644`, sets the token that will be used later to add new nodes to the cluster, and binds the kubeapi server to the `pi01` IP.

Once this is done, we should be able to see the following service up and running:

```shell
imgios@pi01:~$ systemctl status k3s | head -n 10
● k3s.service - Lightweight Kubernetes
     Loaded: loaded (/etc/systemd/system/k3s.service; enabled; preset: enabled)
     Active: active (running) since Sat 2025-02-22 13:56:53 CET; 5 days ago
       Docs: https://k3s.io
   Main PID: 3868 (k3s-server)
      Tasks: 537
     Memory: 3.2G (peak: 6.0G)
        CPU: 5d 12h 44min 48.971s
        ...
```

We should also be able to run `kubectl` commands and see our node up and running:

```shell
imgios@pi01:~$ kubectl get nodes
NAME   STATUS   ROLES                  AGE     VERSION
pi01   Ready    control-plane,master   5d1h    v1.31.5+k3s1
```

Now it's time to add another node in the cluster, but this time the command will take different arguments:

```shell
curl -sfL https://get.k3s.io | K3S_URL=https://192.168.1.211:6443 K3S_TOKEN=r4nd0mt0k3nh0m3l4b sh -
```

For each worker, I will simply provide the kubeapi server IP and the token used to deploy the cluster. K3s will install the agent and perform the operations required to add the node to the cluster. At the end of the process, we should also be able to see also the additional node as part of the cluster using `kubectl`:

```shell
imgios@pi01:~$ kubectl get nodes
NAME   STATUS   ROLES                  AGE     VERSION
pi01   Ready    control-plane,master   5d1h    v1.31.5+k3s1
pi02   Ready    <none>                 3d22h   v1.31.5+k3s1
```

## Storage Solution

By default, K3s creates the [local-path-provisioner](https://github.com/rancher/local-path-provisioner) storage class which provides a way for the Kubernetes users to use the local storage on each node. In my case, I'll be attaching an SSD to both Pis and using that as the cluster block storage, instead of the Pis SD Cards.

To do that, I'll be using [Longhorn](https://longhorn.io/)to do this, but first I need to prepare the SSD. Once attached to `pi01`, these actions are performed:

- Format the disk
- Create `ext4` filesystem
- Set the disk label `pny-400`
- Tell `mount` where to mount it
- Create mount directory `/storage1` and mount it

```shell
imgios@pi01:~$ sudo apt install nfs-common open-iscsi util-linux
# Use lsblk -f to locate the SSD
imgios@pi01:~$ sudo wipefs -a /dev/sda
imgios@pi01:~$ sudo mkfs.ext4 /dev/sda
imgios@pi01:~$ sudo e2label /dev/sda pny-480
imgios@pi01:~$ sudo blkid -s UUID -o value /dev/sda
imgios@pi01:~$ sudo -i && echo "LABEL=pny-480 /storage1		ext4	defaults		1 2" >> /etc/fstab
imgios@pi01:~$ systemctl daemon-reload
imgios@pi01:~$ sudo mkdir /storage1 
imgios@pi01:~$ sudo mount -L pny-480 /storage1
```

Now that the SSD is ready to go, the Longhorn installation is ready to be sent:

```shell
imgios@pi01:~$ helm repo add longhorn https://charts.longhorn.io
imgios@pi01:~$ helm repo update
imgios@pi01:~$ helm upgrade --install --create-namespace longhorn longhorn/longhorn --namespace longhorn-system \
--set defaultSettings.defaultDataPath="/storage1" --set persistence.defaultClassReplicaCount="1" \
--set defaultSettings.defaultReplicaCount="1" --set ingress.enabled=true \
--set ingress.ingressClassName=traefik --set ingress.host=longhorn.homelab.local
```

So I'm deploying Longhorn with an ingress set to `longhorn.homelab.local`, the storage replicas set to 1 (no data replication) and the default data path set to the SSD mount directory `/storage1`.

## Spy on the cluster

Once the storage is configured, the next call is for the monitoring. It's cool to keep an eye on the cluster resource usage, isn't it? Fancy bars, coloured lines, random numbers. This is easily done with Prometheus and Grafana.

Using the [`kube-prometheus-stack`](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) Helm Chart, both can be deployed in a flash:

```shell
imgios@pi01:~$ helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
imgios@pi01:~$ helm repo update
imgios@pi01:~$ helm install monitoring prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace \
--set grafana.ingress.enabled=true --set grafana.ingress.ingressClassName=traefik \
--set grafana.ingress.hosts[0]=grafana.homelab.local
```

This is basically the deployment of both Prometheus and Grafana in the `monitoring` namespace, and an ingress to reach Grafana at `grafana.homelab.local`.

## Conclusion
The cluster is now ready for use and will probably be destroyed and rebuilt many times. This is a perfect playground for exploring many topics, such as:

- Infrastructure-as-Code
- Docker and Containerization
- Kubernetes and Orchestration
- GitOps
- DevOps
- and much more!

Working on this has just made me want to put it all together. I'll be sharing a new post where I'll be tracking the work I've done, from the design stage to assembling my own DIY 10" rack. So far it's cool, but inside a rack would be better!
