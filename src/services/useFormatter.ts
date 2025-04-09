export const formattIdCam = (id: number) => {
    if(id < 10){
        return '0'+ id
    } else{
        return id
    }
}