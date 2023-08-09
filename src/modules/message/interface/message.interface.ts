export interface IMessage {
    type:number,
    title: string;
    content: string;
    send_user_id?: string;
    recv_user_id?: string;
    
}

