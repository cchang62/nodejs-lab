# $1: </path/to/private_key>, $2: </path/to/app_root>
# Usage: bash /Users/Jibamy/Projects/nodejs-lab/lab2-webhook/cmd/app_cd.sh /Users/Jibamy/.ssh/webhook_demo_rsa /Users/Jibamy/Projects/webhook-demo
eval $(ssh-agent -s)
if [ -z $(ssh-add -l | grep -q "$(ssh-keygen -l -f $1 | awk '{print $2}')") ] ; then
    echo "--- register ssh key ---"
    cd $2
    ssh-add $1
    git ls-remote
    git pull
fi
stty -echo
trap "ssh-agent -k" exit