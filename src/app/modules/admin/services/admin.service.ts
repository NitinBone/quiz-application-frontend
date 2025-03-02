import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASIC_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  BASIC_URL: any;

  constructor(private http:HttpClient) { }

  createQuiz(quizDto):Observable<any>{
    return this.http.post(BASIC_URL + "api/quiz",quizDto);
  }

  getAllQuiz():Observable<any>{
    return this.http.get(BASIC_URL + "api/quiz");
  }

  addQuestion(payload: any): Observable<any> {
    return this.http.post(BASIC_URL + "api/quiz/question", payload);
  }

  uploadQuestionsExcel(formData: FormData): Observable<any> {
    return this.http.post(BASIC_URL + "api/quiz/upload", formData, {
      responseType: 'text' // Important if your backend returns plain text like "Questions uploaded successfully!"
    });
  }

  // getTestQuestion(id:number):Observable<any>{
  //   return this.http.get(BASIC_URL + `api/quiz/${id}`);
  // }


  
      getTestQuestion(id: number, userId: number): Observable<any> {
        // console.log(BASIC_URL + `api/quiz/${id}?userId=${userId}`)
        return this.http.get(BASIC_URL + `api/quiz/${id}?userId=${userId}`);
    }
  
  }
  
  

