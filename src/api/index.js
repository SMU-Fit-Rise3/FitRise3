import * as stressApi from './stressAPI';
import * as userInfoApi from './userInfoAPI'
import * as exerciseApi from './exerciseAPI'
import * as calendarApi from './calendarAPI'
import * as mealApi from './mealAPI'
// 여러 API 파일에서 함수들을 가져와 하나의 객체로 export
export default {
  ...stressApi,
  ...userInfoApi,
  ...exerciseApi,
  ...calendarApi,
  ...mealApi
};