if [ $(ps ax | grep [s]sh-agent | wc -l) -gt 0 ] ; then
    echo "ssh-agent is already running"
    pwd
    whoami
    eval $(ssh-agent -s)  
    footprint=$(ssh-keygen -l -f /Users/Jibamy/.ssh/webhook_demo_rsa | awk '{print $2}')
    # if  ssh-add -l | \
    #     grep -q "$(ssh-keygen -l -f /Users/Jibamy/.ssh/webhook_demo_rsa | awk '{print $2}')"; \
    #     then echo yes;
    #     else echo no;
    # fi
    if [[ -z $(ssh-add -l | grep -q footprint) ]]; then
        echo yes;
    else
        echo no;
    fi
    # trap "ssh-agent -k" exit
else
    eval $(ssh-agent -s)  
    # export SSH_AGENT_PID_REPO=$(eval $(ssh-agent -s) | awk '{print $3}')
    if [ "$(ssh-add -l)" == "The agent has no identities." ] ; then
        ssh-add ~/.ssh/webhook_demo_rsa
        git ls-remote
    fi

    # Don't leave extra agents around: kill it on exit. You may not want this part.
    trap "ssh-agent -k" exit
    # kill -9 $SSH_AGENT_PID_REPO
    # kill -HUP "$SSH_AGENT_PID_REPO"
fi

# if [ps -p ${SSH_AGENT_PID} > /dev/null];
#   then
#   if [ps -p ${SSH_AGENT_PID}];
#   then
#       echo "ssh-agent is already running"
#       # Do something knowing the pid exists, i.e. the process with $PID is running
#   else
#       eval `ssh-agent -s`
#   fi
# fi

# Ref.
# https://www.xspdf.com/help/52415553.html
# if [[ -z "$SSH_AGENT_PID" ]]; then
#     if [[ $(pgrep ssh-agent) ]]; then
#         export SSH_AGENT_PID=$(pgrep ssh-agent)
#         echo "Found existing ssh-agent PID, SSH_AGENT_PID=${SSH_AGENT_PID}"
#     else
#         echo "Starting fresh ssh agent"
#         # eval `ssh-agent`
#         eval $(ssh-agent -s) 
#     fi
# fi
# ref. 
# https://unix.stackexchange.com/questions/132791/have-ssh-add-be-quiet-if-key-already-there
# https://blog.techbridge.cc/2019/11/15/linux-shell-script-tutorial/
# * http://www.study-area.org/linux/system/linux_shell.htm
# [[]] http://mywiki.wooledge.org/BashFAQ/031
if  ssh-add -l | \
    grep -q "$(ssh-keygen -l -f /Users/Jibamy/.ssh/webhook_demo_rsa | awk '{print $2}')";
    then echo yes;
    else echo no;
fi