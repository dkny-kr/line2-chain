# line2-chain

## 개요
[서울 열린데이터광장](http://data.seoul.go.kr)에서 제공하는 API(SearchSTNTimeTableByFRCodeService)를 이용해 서울교통공사 2호선 본선(을지로순환선)의 이전/다음열차 및 행선정보를 출력합니다.

## 요구사항
- 서울 열린데이터광장에서 발급한 API Key가 필요합니다.

## 주의사항
- 실제 운행정보와 차이가 있을 수 있습니다.

## 사용방법
data.seoul.go.kr 에서 발급받은 API Key를 설정 후 getChain()을 통해 데이터를 불러옵니다.
getChain()의 parameter로는 아래의 3가지를 사용할 수 있습니다.
- 'weekday' (평일)
- 'saturday' (토요일)
- 'holiday' (일요일/공휴일)

```javascript
let Line2Chain = require('./line2-chain');
Line2Chain.config('YOUR_API_KEY');  // data.seoul.go.kr 에서 발급받은 키
Line2Chain.getChain('weekday')
  .then(chain => {
    console.log(chain);
  })
  .catch(e => {
    console.log(e);
  })
```
```
[
  { train_num: '2184',
    from: '성수',
    dest: '내선순환',
    prev_train: '2138',
    next_train: '2220' },
  { train_num: '2538',
    from: '성수',
    dest: '성수',
    prev_train: '2506',
    next_train: -1 },
  { train_num: '2536',
    from: '성수',
    dest: '성수',
    prev_train: '2504',
    next_train: -1 },
  ...
]
```

- 예제(run.js) 실행방법 및 결과예시는 아래와 같습니다.
```bash
$ npm install
$ node run.js
train_num,from,dest,prev_train,next_train
2184,성수,내선순환,2138,2220
2037,신도림,외선순환,-1,2103
2040,신도림,내선순환,-1,2092
2526,성수,성수,2494,-1
2540,성수,신도림,2508,-1
2542,성수,을지로입구,2512,-1
2544,성수,홍대입구,2516,-1
...
```
