---
title: "Reviving a D-link DSL-2750B as access point in 2024"
date: 2024-06-25
draft: false
toc: true
tags: ["homelab", "networking"]
keywords: ["homelab", "networking", "d-link", "access point"]
summary: "In this post I share my thoughts and experience about using an old D-Link DSL 2750B as access point, after that my Wi-Fi range extender died."
---

Year 2024.

5G mobile networks able to reach incredible fast speed and low latency.

Gigabit fixed networks are now more common than ADSL was a few years ago.

Me reviving an old ADSL2+ Wireless N modem router as backup solution for a Wi-Fi range extended that decided (or is about to) to die.

## I'm tired, boss

5 or 6 years ago, I decided to get a [Netgear EX3700 Wi-Fi Range Extender](https://www.netgear.com/uk/home/wifi/range-extenders/ex3700/) to finally bring the Wi-Fi connectivity also in my bedroom. I though that this small white box was kinda perfect to suit my needs:

- Having Wi-Fi connectivity in my bedroom, and..
- Having Wi-Fi connectivity in my bedroom.

It was quite demanding, don't you think?

Jokes apart, this product was:

- Discreet enough not to disturb anyone in the house.
- Quite small and easy to hide.
- Up to 750Mbps with support for both 2.4GHz and 5GHz.
- Access Point configuration using the Gigabit Ethernet port.

And this thing worked like a charm until the last two months, when it became very unstable. It would reset itself every now and then, or disconnect every ~2 hours. A hard reset was all it took to fix the random resets, it was still unstable and would disconnect from time to time.

## Save it from the trash bin

Many years ago I had a D-Link DSL-2750B as my internet gateway and it worked pretty well until I upgraded my internet service to Gigabit Fibre-to-the-Home (FTTH). Getting a gigabit network meant changing the internet gateway to something newer and capable of handling the speed and technology, and that was when I left the good old D-Link in a paper box.

Now it's back, but this time it's being used as an access point to bring Wi-Fi connectivity to my bedroom. It's still not up to gigabit network speeds, but that doesn't matter this time. It doesn't matter because the devices I use over Wi-Fi are fine with ~50-60 Mbps (or even less).

## D-Link DSL-2750B configuration as Access Point

I was expecting it to be quite challenging to configure, but instead it was quite easy, also thanks to [@mrgionsi](https://github.com/mrgionsi)'s tips.

(tl;dr;)

- As first step, I just performed a "factory reset", to make sure that no old configuration was still loaded in. I did it by pressing the reset button available behind the D-Link.
- Then I connected to the D-Link using an Ethernet cable, and mainly configured two things:
  - LAN setup
  - Wireless setup
- Last but not least: plug an Ethernet cable from the main gateway into a D-Link LAN port (not WAN!)

The first step needs no explanation, just press the D-Link reset button.

The **LAN setup** requires two steps to perform: first, I chose an IP (e.g., `192.168.1.2`) as the D-Link address from the main gateway's internal subnet (e.g., `192.168.1.0/24`), and later I will make sure that this IP won't be assigned by the gateway to any other device. Then I changed the DHCP settings to use the main gateway as the DHCP server, so I set the DHCP Relay option to the main gateway IP address (e.g., `192.168.1.1`).

The **Wireless setup** is no magic, just changing both the SSID and network password to something fancy and more complex.

Once I had updated and applied the configuration to the D-Link, I removed the Ethernet cable connecting the PC directly to the D-Link and used it to connect from the gateway to a D-Link LAN port.

## Conclusion

In my opinion, this is one of the best solutions that can be achieved by reusing spare hardware when there are no special needs and it all costs $0. We often buy a lot of new stuff and forget about the old stuff that's still working fine.

In my case, using the D-Link as an access point seems like a good choice, allowing me to connect to the home network even from my bedroom. Devices connected via the D-Link can get ~60Mbps, which is more than enough to do a lot of things, even watch Netflix in high quality.
