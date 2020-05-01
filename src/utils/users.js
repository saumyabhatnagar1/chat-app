const users=[];

const addUser=({id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase();

    if(!room||!username){
        return {
            error:'Username and room are required'
        }
    }
    const existingUser=users.find((user)=>{
        return user.room===room&&user.username===username;

    })

    if(existingUser){
        return {
            error:'The username is taken'
        }
    }

    const user={id,username,room}
    users.push(user)
    return{
        user
    }
}
const removeUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id;
    })

    if(index!=-1)
    return users.slice(index,1)[0];
}

const getUser=(id)=>{
    return users.find((user)=>{
        return(user.id===id)
    })
}

const getUserRoom=(room)=>{
    const userinroom=users.find((user)=>{
        return user.room==room
    })
    return users;
}

module.exports={
    addUser,getUser,getUserRoom,removeUser
}