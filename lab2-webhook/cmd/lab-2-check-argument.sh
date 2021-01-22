# eval $(ssh-agent -s)
# echo 'hello'
# stty -echo
# echo 'world'
# trap "ssh-agent -k" exit > /dev/null 2>&1
# ps -ax | grep "[s]sh-agent"
# ls -alh

if [ -z "$*"  ];
then
    echo "no argument"
    exit 1
fi

echo $*

# check last exit status
# echo $?
Help()
{
    # Display Help
    echo "Add description of the script functions here."
    echo
    echo "Syntax: scriptTemplate [-g|h|v|V]"
    echo "options:"
    echo "g     Print the GPL license notification."
    echo "h     Print this Help."
    echo "v     Verbose mode."
    echo "V     Print software version and exit."
    echo
}

while getopts “ht:r:p:v” OPTION
do
    case $OPTION in
        h)
            Help
            exit 1
            ;;
        t)
            TEST=$OPTARG
            echo ${TEST}
            ;;
        r)
            SERVER=$OPTARG
            ;;
        p)
            PASSWD=$OPTARG
            ;;
        v)
            VERBOSE=1
            ;;
        ?)
            Help
            exit
            ;;
    esac
done