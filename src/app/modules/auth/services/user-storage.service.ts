import { Injectable } from '@angular/core';

const USER ="q_user";

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor() { }

  static saveUser(user:any):void{
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER,JSON.stringify(user));
  }


  // testResult = {
  //   id: 14,
  //   totalQuestion: 1,
  //   correctAnswer: 0,
  //   percentage: 0,
  //   user: {
  //     userId: 3,
  //     email: "user1@gmail.com",
  //     password: "User@123"
  //   },
  //   quiz: {
  //     id: 2,
  //     title: "Java Basics",
  //     description: "A quiz about Java fundamentals"
  //   }
  // }; that type data was saved in localstorage

    static saveResult(testResult: any): void {
        localStorage.setItem('testResult', JSON.stringify(testResult));
    }

    static getResult(): any {
        const result = localStorage.getItem('testResult');
        return result ? JSON.parse(result) : null;
    }

  static getUser():any{
    return JSON.parse(localStorage.getItem(USER)); 
  }

  static getUserId(): number | null {
    const user = this.getUser();
    return user ? user.id : null;  
}
  
  static getUserRole():string{
    const user=this.getUser();
    if(user == null){return '';}
    return user.role;
  }

  static isAdminLoggedIn():boolean{
    const role:string=this.getUserRole();
   return role == 'ADMIN';
  }

  static isUserLoggedIn():boolean{
    const role:string=this.getUserRole();
   return role == 'USER';
  }

  static signOut():void{
    window.localStorage.removeItem(USER);
  }

  
}
