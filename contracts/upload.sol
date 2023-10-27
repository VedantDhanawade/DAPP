// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Upload {
  
  struct Access{ //variable that decides access to other accounts 
     address user; 
     bool access; //true or false
  }
  mapping(address=>string[]) value; // stores url of uploaded images 
  mapping(address=>mapping(address=>bool)) ownership; //shows ownership of files nested mapping 
  mapping(address=>Access[]) accessList; // stores list of acounts that have access from a perticular account 
  mapping(address=>mapping(address=>bool)) previousData;

  function add(address _user,string memory url) external {
      value[_user].push(url);
  }
  function allow(address user) external {//def
      ownership[msg.sender][user]=true; 
      if(previousData[msg.sender][user]){
         for(uint i=0;i<accessList[msg.sender].length;i++){
             if(accessList[msg.sender][i].user==user){
                  accessList[msg.sender][i].access=true; //checks if user already have access
             }
         }
      }else{
          accessList[msg.sender].push(Access(user,true));  
          previousData[msg.sender][user]=true;  // if user is not in accessList then gives access
      }
    
  }
  function disallow(address user) public{
      ownership[msg.sender][user]=false;
      for(uint i=0;i<accessList[msg.sender].length;i++){
          if(accessList[msg.sender][i].user==user){ //searches perticular user in access list 
              accessList[msg.sender][i].access=false;  //removes its access
          }
      }
  }

  function display(address _user) external view returns(string[] memory){
      require(_user==msg.sender || ownership[_user][msg.sender],"You don't have access");
      return value[_user]; //display the files to account which have access
  }

  function shareAccess() public view returns(Access[] memory){
      return accessList[msg.sender];
  }
}
