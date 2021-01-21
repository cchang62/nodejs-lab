# Linux CMD Tutorial

## CURL with time

$ curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:3000/ping"

Ref. [stackoverflow](https://stackoverflow.com/questions/18215389/how-do-i-measure-request-and-response-times-at-once-using-curl)

Content of curl-format.txt

```txt
     time_namelookup:  %{time_namelookup}s\n
        time_connect:  %{time_connect}s\n
     time_appconnect:  %{time_appconnect}s\n
    time_pretransfer:  %{time_pretransfer}s\n
       time_redirect:  %{time_redirect}s\n
  time_starttransfer:  %{time_starttransfer}s\n
                     ----------\n
          time_total:  %{time_total}s\n
```

## stdin, stdout, stderr

Ref. [Definition of 2>&1](https://www.opencli.com/linux/dev-null-2-and-1-meanning)
Linux提供了三種標準I/O，分別為：
standard input (STDIN) 代號 0：標準輸入，預設為鍵盤
standard output (STDOUT) 代號 1：標準輸出，預設為終端機視窗
standard error (STDERR) 代號 2：標準錯誤輸出，預設為終端機視窗
$ grep da * 0> grep-stdin.txt 1> grep-stdout.txt 2> grep-errors.txt

1. < 是input，> 是output
2. <預設值是0，>預設值是1。即<與0<同，>與 1>同。下面的例子若有疑問，可試著代入展開。

>&n: 即1>&n，也就是將stdout複制給 file descriptor n (使用dup(2))
<&n: 即0<&n，將file descriptor n 複製到stdin
<&-: 即0<&-，關閉stdin
>&-: 即1>&-，關閉stdout

## SSH-AGENT

### Manually enable ssh-agent

```sh
# start the ssh-agent in the background
$ eval $(ssh-agent -s) # 把 ssh-agent 的輸出交給 eval 執行
Agent pid 59566
```

Ref. [ssh-agent explanation](https://linux.101hacks.com/unix/ssh-agent/)

## Linux Processor

Ref. [](https://www.cyut.edu.tw/~ywfan/1109linux/201109chapter9process.htm)

## Access Github Private Repo
After creating ssh key and uploding pub key to github repo, you should:

1. Enable ssh-agent

   ```sh
   # Manually enable ssh-agent
   $ eval $(ssh-agent -s) 
   # Show ssh-agent in process
   $ ps -ef | grep ssh-agent
   ```

2. Add ssh key to agent

   ```sh
   $ ssh-add ~/.ssh/<your_private_key>
   # ex. $ ssh-add ~/.ssh/webhook_demo_rsa
   $ ssh-add -L
   # ssh-rsa AAAAB3NzaC1...WTno0= Jibamy@ChihMings-Mac.local 
   # Otherwise, you will see
   # The agent has no identities.
   
   # $ ssh-add -d ~/.ssh/id_xxx.pub
   # To remove private key from the agent

   # kill_old_ssh_agents
   # Ref. https://gist.github.com/gubatron/2d97b31b0621c459f8b5ee8665c9f7b9
   ```

3. Accees private repo

   ```sh
   $ git ls-remote
   # From git@github.com:cchang62/webhook-demo.git
   # 70d14aea8448f903c667f602795e279f43405bce	HEAD
   # 70d14aea8448f903c667f602795e279f43405bce	refs/heads/main
   ```

## SSH-Agent Forwarding
Ref. [ssh-key-forwarding](https://blog.gtwang.org/linux/using-ssh-agent-forwarding-to-avoid-being-asked-passphrase/)

   ```sh
   $ ssh -A username@192.1168.0.1 # while 192.168.0.1 is the 1st server.
   # 使用 SSH forwarding 的方式很簡單，只要使用 ssh-add 加入金鑰之後，在執行 ssh 時加入一個 -A 參數即可
   ```

## Use Ngrok
```sh
$ ./ngrok http 3000
```

