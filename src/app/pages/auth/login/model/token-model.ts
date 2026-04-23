export class TokenModel {
    success: boolean = false;
    message: string = '';
    data: Data | undefined;


}

export class Data {
    expiration: string = '';
    token: string = '';
    claims: string[] | undefined;
    refreshToken: string = '';
  
}