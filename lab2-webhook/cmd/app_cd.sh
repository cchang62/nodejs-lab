# $1: </path/to/private_key>, $2: </path/to/app_root>
# Usage: bash /Users/Jibamy/Projects/nodejs-lab/lab2-webhook/cmd/app_cd.sh -p /Users/Jibamy/.ssh/webhook_demo_rsa -a /Users/Jibamy/Projects/webhook-demo
# if [[ $# -lt 2 ]];
# then
#     echo "need 2 arguments"
#     exit 1
# fi
if [ -z "$*" ];
then
    echo "no argument"
    exit 1
fi

Help()
{
    # Display Help
    echo "The script function updates the app service."
    echo
    echo "Usage: bash /path/to/app_cd.sh -p /path/to/private_key -a /path/to/app_root"
    echo
    echo "Syntax: cmd [-h|p <arg>|a <arg>]"
    echo "options:"
    echo "p     Set private key. p: private key."
    echo "a     Set app root path. a: app root."
    echo "h     Print this Help."
    echo
}

while getopts ":p:a:h" OPTION; do
    case $OPTION in
        h) # display Help
            Help
            exit;;
        p)
            PRIVATE_KEY=$OPTARG
            ;;
        a)
            APP_ROOT=$OPTARG
            ;;
    esac
done

eval $(ssh-agent -s)
if [ -z $(ssh-add -l | grep -q "$(ssh-keygen -l -f $PRIVATE_KEY | awk '{print $2}')") ] ; then
    echo "--- register ssh key ---"
    cd $APP_ROOT
    ssh-add $PRIVATE_KEY
    # echo $APP_ROOT
    # echo $PRIVATE_KEY
    git ls-remote
    git pull
fi
# stty -echo
trap "ssh-agent -k" exit