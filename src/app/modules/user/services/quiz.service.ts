import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASIC_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http:HttpClient) { }

  getAllQuiz():Observable<any>{
      return this.http.get(BASIC_URL + "api/quiz");
    }

  
    // getTestQuestion(id:number):Observable<any>{
    //     return this.http.get(BASIC_URL + `api/quiz/${id}`);
    //   }


    getTestQuestion(id: number, userId: number): Observable<any> {
      // console.log(BASIC_URL + `api/quiz/${id}?userId=${userId}`)
      return this.http.get(BASIC_URL + `api/quiz/${id}?userId=${userId}`);
  }

  submitTest(submitTestDto: any) {
    return this.http.post('http://localhost:8080/api/user/submit-test', submitTestDto);
  }


  
}
