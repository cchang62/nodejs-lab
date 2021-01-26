sudo touch /lib/systemd/system/your-service.service
sudo chmod 777 /lib/systemd/system/your-service.service

sudo cat > /lib/systemd/system/your-service.service << EOF
[Unit]
Description=Your Service Web App daemon
#After=postgresql.service
StartLimitIntervalSec=3

[Service]
Type=simple
WorkingDirectory=/home/username/yourproject/
ExecStart=/usr/local/go/bin/go run main.go
Restart=always
RestartSec=2
User=username

[Install]
WantedBy=multi-user.target

EOF

# Build a link to /etc/systemd/system
sudo ln -s /lib/systemd/system/your-service.service /etc/systemd/system
# ll /etc/systemd/system/acc*
# lrwxrwxrwx  1 root root   42 Jan 26 15:34  your-service.service -> /lib/systemd/system/your-service.service*

sudo systemctl enable  your-service.service
sudo systemctl start your-service
# To check this service is active
# systemctl is-active your-service.service