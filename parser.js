convertTime = (fmt_timestr) => {
  if(fmt_timestr.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)) {
    let _t = fmt_timestr.split(':');

    let h = parseInt(_t[0]) * 60 * 60;
    let m = parseInt(_t[1]) * 60;
    let s = parseInt(_t[2]);

    return h + m + s;
  } else {
    return null;
  }
};

getSchedule = (raw_data) => {
  const data_set = raw_data.SearchSTNTimeTableByFRCodeService.row;
  let ret = [];

  // RAW DATA 에서 필요한 데이터를 추출/병합
  for(let raw_data of data_set) {
    if(raw_data.TRAIN_NO.startsWith('2')) { // 본선데이터만 취급
      let data = ret.find(d => (d.num === raw_data.TRAIN_NO));

      if(typeof data === 'undefined') {
        data = {
          num: raw_data.TRAIN_NO,
          _from: null,
          dest: null,
          prev: null,
          next: null,
          _lft_time: '00:00:00',
          _arr_time: '00:00:00'
        };

        ret.push(data);
      }

      // 출발지(임시)
      data._from = raw_data.SUBWAYSNAME;

      // 행선지(임시)
      data.dest = raw_data.SUBWAYENAME;

      // 출발시각(임시)
      if(raw_data.LEFTTIME !== '00:00:00') {
        data._lft_time = raw_data.LEFTTIME;
      }

      // 도착시각(임시)
      if(raw_data.ARRIVETIME !== '00:00:00') {
        data._arr_time = raw_data.ARRIVETIME;
      }
    }
  }

  // 추출된 데이터에서 이전/다음 열차번호 계산
  for(let data of ret) {
    // 이전
    let _prev = ret.find(expect => {
      let diff = convertTime(data._lft_time) - convertTime(expect._arr_time);
      return (diff > 0 && diff <= 120);
    });

    if(typeof _prev !== 'undefined') {
      data.prev = _prev.num;
    }

    // 다음
    let _next = ret.find(expect => {
      let diff = convertTime(expect._lft_time) - convertTime(data._arr_time);
      return (diff > 0 && diff <= 120);
    });

    if(typeof _next !== 'undefined') {
      data.next = _next.num;
    }
  }

  // 행선지 수정
  for(let data of ret) {
    if(data.next !== null) {
      if(parseInt(data.num) % 2 === 0) {
        data.dest = '내선순환';
      } else {
        data.dest = '외선순환';
      }
    }
  }

  return ret;
};
