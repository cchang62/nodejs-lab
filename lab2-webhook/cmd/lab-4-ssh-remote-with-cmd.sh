# Ref.
# https://www.cyberciti.biz/faq/linux-unix-osx-bsd-ssh-run-command-on-remote-machine-server/

#!/bin/bash

# Run multiple cmds on single server

# ssh server1 << HERE
#     command1
#     command2
# HERE
#
# ssh username@server1.domain.name << EOF
#     date
#     hostname
#     cat /etc/resolv.conf
# EOF

for s in server1 server2 server3
do
    ssh username@${s} uptime
done

for s in server{1..4}.domain.name
do
    ssh username@${s} 'bash -s' < /home/username/bin/test.sh
done