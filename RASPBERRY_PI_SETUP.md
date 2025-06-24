
# Raspberry Pi Setup voor Dagplanning Applicatie

Deze handleiding bevat gedetailleerde instructies voor het opzetten van de Dagplanning Applicatie op een Raspberry Pi met een touchscreen.

## Hardware vereisten

- Raspberry Pi 4B (4GB+ RAM aanbevolen)
- Officiële Raspberry Pi 7-inch touchscreen of compatibel alternatief
- MicroSD-kaart (16GB+ aanbevolen)
- Stroomvoorziening (3A+ aanbevolen)
- Optioneel: Case voor Raspberry Pi en touchscreen
- Optioneel: USB-toetsenbord en muis voor initiële setup

## 1. Raspberry Pi OS installeren

1. Download de **Raspberry Pi Imager** van de [officiële website](https://www.raspberrypi.org/software/)
2. Start de Raspberry Pi Imager en kies **Raspberry Pi OS (32-bit)** of de 64-bit versie als je een Pi 4 gebruikt
3. Selecteer je MicroSD-kaart
4. Klik op het tandwiel-icoontje voor geavanceerde opties en:
   - Stel een hostname in (bijv. "dagplanning")
   - Schakel SSH in
   - Stel een gebruikersnaam en wachtwoord in
   - Configureer WiFi als je geen ethernet gebruikt
   - Stel de lokale instellingen in op de juiste tijdzone en toetsenbordindeling
5. Klik op "WRITE" en wacht tot het proces is voltooid

## 2. Touchscreen aansluiten en configureren

### Officiële Raspberry Pi touchscreen

1. Sluit het touchscreen aan op de Raspberry Pi volgens de meegeleverde instructies
2. Start de Raspberry Pi op met het aangesloten scherm
3. Het officiële touchscreen zou automatisch moeten werken met Raspberry Pi OS

### Kalibratie (indien nodig)

Als het touchscreen niet accuraat is, kun je het kalibreren:

```bash
# Installeer kalibratietool
sudo apt update
sudo apt install -y xinput-calibrator

# Start kalibratie
DISPLAY=:0.0 xinput_calibrator
```

Volg de instructies op het scherm en noteer de kalibratiewaarden. Voeg deze toe aan:

```bash
sudo nano /etc/X11/xorg.conf.d/40-libinput.conf
```

Voeg de volgende regels toe (vervang de waarden door je eigen kalibratiewaarden):

```
Section "InputClass"
        Identifier "libinput touchscreen catchall"
        MatchIsTouchscreen "on"
        MatchDevicePath "/dev/input/event*"
        Driver "libinput"
        Option "CalibrationMatrix" "1 0 0 0 1 0 0 0 1"
EndSection
```

## 3. Schermoriëntatie instellen

Als je het scherm in portretmodus wilt gebruiken:

```bash
sudo nano /boot/config.txt
```

Voeg een van de volgende regels toe om de schermoriëntatie aan te passen:

```
# Voor 90 graden rotatie (rechtsom)
display_rotate=1

# Voor 180 graden rotatie (ondersteboven)
display_rotate=2

# Voor 270 graden rotatie (linksom)
display_rotate=3
```

Sla het bestand op en start de Raspberry Pi opnieuw op:

```bash
sudo reboot
```

## 4. Automatisch inloggen configureren

Voor een kiosk-achtige opstelling wil je dat de Raspberry Pi automatisch inlogt:

```bash
sudo raspi-config
```

Navigeer naar: **System Options** > **Boot / Auto Login** > **Desktop Autologin**

Selecteer de optie voor automatisch inloggen naar de desktop en sla op.

## 5. Node.js installeren

```bash
# Update het systeem
sudo apt update && sudo apt upgrade -y

# Installeer Node.js en npm
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Controleer de installatie
node -v
npm -v
```

## 6. Webserver installeren

```bash
# Installeer Nginx
sudo apt install -y nginx

# Start en enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 7. Browser in Kiosk-modus configureren

### Chromium in Kiosk-modus

```bash
# Installeer Chromium (als het nog niet geïnstalleerd is)
sudo apt install -y chromium-browser

# Maak een autostart directory
mkdir -p ~/.config/autostart

# Maak een autostart bestand aan
nano ~/.config/autostart/kiosk.desktop
```

Voeg het volgende toe aan het bestand:

```
[Desktop Entry]
Type=Application
Name=Dagplanning Kiosk
Exec=chromium-browser --kiosk --disable-restore-session-state --noerrdialogs --disable-infobars --check-for-update-interval=31536000 http://localhost
```

Dit zorgt ervoor dat Chromium start in kiosk-modus (volledig scherm zonder browser-interface) en navigeert naar de lokaal gehoste applicatie.

## 8. Touch-specifieke optimalisaties

### Virtueel toetsenbord installeren (voor invoer zonder fysiek toetsenbord)

```bash
sudo apt install -y matchbox-keyboard
```

### Schermbeveiliging uitschakelen

Om te voorkomen dat het scherm uitgaat of in slaapstand gaat:

```bash
# Open de energiebeheerinstellingen
sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
```

Voeg deze regels toe:

```
@xset s off
@xset -dpms
@xset s noblank
```

## 9. Applicatie installeren

Volg de installatie-instructies in de hoofdreadme (README.md) voor het installeren van de applicatie.

## 10. Performance optimalisaties

### Swapfile vergroten

```bash
# Bekijk huidige swap instellingen
free -h

# Schakel huidige swap uit
sudo dphys-swapfile swapoff

# Bewerk swap configuratie
sudo nano /etc/dphys-swapfile
```

Verander de CONF_SWAPSIZE waarde naar 1024 (voor 1GB swap):
```
CONF_SWAPSIZE=1024
```

```bash
# Initialiseer en schakel de nieuwe swap in
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

### GPU geheugen toewijzen

Voor een touchscreen-applicatie kun je meer geheugen toewijzen aan de GPU:

```bash
sudo nano /boot/config.txt
```

Zoek of voeg toe:
```
gpu_mem=128
```

## 11. Netwerk optimalisaties

### Statisch IP-adres configureren

Voor een betrouwbare netwerkverbinding is het handig om een statisch IP-adres in te stellen:

```bash
sudo nano /etc/dhcpcd.conf
```

Voeg onderaan het bestand toe (pas aan voor je netwerk):

```
interface eth0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1 8.8.8.8

# Of voor WiFi
interface wlan0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1 8.8.8.8
```

## 12. Beveiligingsmaatregelen

### Firewall configureren

```bash
# Installeer UFW (Uncomplicated Firewall)
sudo apt install -y ufw

# Configureer basis regels
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# Schakel firewall in
sudo ufw enable
```

### Automatische updates

```bash
# Installeer unattended-upgrades
sudo apt install -y unattended-upgrades apt-listchanges

# Configureer automatische updates
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 13. Backup en herstel

### Automatische backups instellen

```bash
# Installeer rsync
sudo apt install -y rsync

# Maak een backup script
nano ~/backup.sh
```

Voeg het volgende toe aan het script:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="/home/pi/backups"
mkdir -p $BACKUP_DIR

# Database backup
sqlite3 /home/pi/dagplanning-app/data/day-planning-app.db .dump > $BACKUP_DIR/database-$DATE.sql

# Configuratie backup
rsync -av /home/pi/dagplanning-app/server.js $BACKUP_DIR/
rsync -av /home/pi/dagplanning-app/.env $BACKUP_DIR/

# Log backup
echo "Backup completed on $DATE" >> $BACKUP_DIR/backup.log
```

Maak het script uitvoerbaar:
```bash
chmod +x ~/backup.sh
```

Voeg het toe aan crontab voor automatische uitvoering:
```bash
crontab -e
```

Voeg toe voor een wekelijkse backup op zondag om 2 uur 's nachts:
```
0 2 * * 0 /home/pi/backup.sh
```

## 14. Probleemoplossing

### Scherm issues

Als het touchscreen niet reageert:
```bash
# Controleer of de touchscreen wordt herkend
dmesg | grep -i touch

# Herstart de X-server
sudo systemctl restart lightdm
```

### Prestatieproblemen

Als de applicatie traag draait:
```bash
# Controleer CPU gebruik
top

# Controleer geheugen gebruik
free -h

# Controleer temperatuur (oververhitting kan leiden tot throttling)
vcgencmd measure_temp
```

### Browser herstart

Als de browser vastloopt, kun je een cron-job instellen om deze regelmatig te herstarten:

```bash
crontab -e
```

Voeg toe voor een dagelijkse herstart om 3 uur 's nachts:
```
0 3 * * * DISPLAY=:0 pkill chromium-browser && sleep 10 && DISPLAY=:0 chromium-browser --kiosk --disable-restore-session-state http://localhost
```

## Onderhoud

### Systeem updates

Voer regelmatig updates uit:

```bash
sudo apt update && sudo apt upgrade -y
```

### Software updates

Om de applicatie bij te werken:

```bash
cd /home/pi/dagplanning-app
git pull
npm install
cd client
npm run build
```

## Veelgestelde vragen

### Hoe reset ik de applicatie als deze vastloopt?

```bash
# Herstart de backend service
sudo systemctl restart dagplanning-backend

# Herstart de browser
DISPLAY=:0 pkill chromium-browser && sleep 5 && DISPLAY=:0 chromium-browser --kiosk --disable-restore-session-state http://localhost
```

### Hoe verander ik de helderheid van het scherm?

Voor het officiële Pi touchscreen:

```bash
# Maximum helderheid
echo 255 | sudo tee /sys/class/backlight/rpi_backlight/brightness

# Lagere helderheid (waarden 0-255)
echo 128 | sudo tee /sys/class/backlight/rpi_backlight/brightness
```

### Hoe kan ik op afstand toegang krijgen tot de Raspberry Pi?

Via SSH:
```bash
ssh pi@IP_ADRES_VAN_JE_PI
```

Voor grafische toepassingen, installeer VNC:
```bash
sudo apt install -y realvnc-vnc-server realvnc-vnc-viewer
sudo raspi-config
```

Ga naar: **Interface Options** > **VNC** > **Yes**
