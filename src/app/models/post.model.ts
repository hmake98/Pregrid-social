export class Post {
    userid: string;
    status: string;
    postid: string;
    timestamp: number;
    post_status: string = "Public";
    post_images: Array<string>;
}