eval $(ssh-agent -s)
echo 'hello'
stty -echo
echo 'world'
trap "ssh-agent -k" exit > /dev/null 2>&1
ps -ax | grep "[s]sh-agent"
ls -alh