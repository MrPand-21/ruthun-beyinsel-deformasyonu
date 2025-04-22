#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

clear

graffiti_frames=(
"
${CYAN}██████╗ ███████╗██████╗         ${PURPLE}██████╗ ██╗ ██████╗ ${NC}
${CYAN}██╔══██╗██╔════╝██╔══██╗        ${PURPLE}██╔══██╗██║██╔═══██╗${NC}
${CYAN}██████╔╝███████╗██████╔╝        ${PURPLE}██████╔╝██║██║   ██║${NC}
${CYAN}██╔═══╝ ╚════██║██╔══██╗        ${PURPLE}██╔══██╗██║██║   ██║${NC}
${CYAN}██║     ███████║██║  ██║        ${PURPLE}██████╔╝██║╚██████╔╝${NC}
${CYAN}╚═╝     ╚══════╝╚═╝  ╚═╝        ${PURPLE}╚═════╝ ╚═╝ ╚═════╝ ${NC}
"
"
${PURPLE}██████╗ ███████╗██████╗         ${GREEN}██████╗ ██╗ ██████╗ ${NC}
${PURPLE}██╔══██╗██╔════╝██╔══██╗        ${GREEN}██╔══██╗██║██╔═══██╗${NC}
${PURPLE}██████╔╝███████╗██████╔╝        ${GREEN}██████╔╝██║██║   ██║${NC}
${PURPLE}██╔═══╝ ╚════██║██╔══██╗        ${GREEN}██╔══██╗██║██║   ██║${NC}
${PURPLE}██║     ███████║██║  ██║        ${GREEN}██████╔╝██║╚██████╔╝${NC}
${PURPLE}╚═╝     ╚══════╝╚═╝  ╚═╝        ${GREEN}╚═════╝ ╚═╝ ╚═════╝ ${NC}
"
)

for frame in "${graffiti_frames[@]}"; do
    clear
    echo -e "$frame"
    sleep 0.1 
done

spinner() {
    local pid=$1
    local delay=0.07 
    local spinstr='|/-\'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

echo -e "${BLUE}[*] Checking if port 5173 is in use...${NC}"

if ! nc -z localhost 5173 >/dev/null 2>&1; then
    echo -e "${GREEN}[+] Port 5173 is not in use. Starting npm run dev...${NC}"
    npm run dev &
    spinner $!
else
    echo -e "${YELLOW}[!] Something is already running on port 5173. Attempting to terminate...${NC}"
    PID=$(lsof -t -i:5173)
    if [ -n "$PID" ]; then
        echo -e "${RED}[!] Killing process $PID on port 5173${NC}"
        kill -9 $PID
                            
        for i in {1..2}; do  
            echo -ne "${YELLOW}[*] Waiting for port to be released.${NC}\r"
            sleep 0.2 
            echo -ne "${YELLOW}[*] Waiting for port to be released..${NC}\r"
            sleep 0.2
            echo -ne "${YELLOW}[*] Waiting for port to be released...${NC}\r"
            sleep 0.2
        done
            echo -e "\n${GREEN}[+] Starting npm run dev...${NC}"
            npm run dev
    else
            echo -e "${RED}[-] Could not find process on port 5173.${NC}"
    fi
fi