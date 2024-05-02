import * as stressApi from './stressAPI';

// 여러 API 파일에서 함수들을 가져와 하나의 객체로 export
export default {
  ...stressApi
};