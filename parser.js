const parse = json => {
  let ret = [];
  
  if(typeof json.searchstntimetablebyfrcodeservice === 'undefined') {
    throw `${json.result.message.replace(/\n| {2,}/g, ' ')} (${json.result.code})`;
    return null;
  }

  try {
    const rows = json.searchstntimetablebyfrcodeservice.row;

    for(const row of rows) {
      if(parseInt(row.train_no) >= 2000) {
        let _row = ret.find(d => (d.train_num === row.train_no));

        if(typeof _row === 'undefined') {
            _row = {
                train_num: row.train_no,
                from: row.subwaysname,
                dest: row.subwayename,
                prev_train: -1,
                next_train: -1,
                _lft_time: 0,
                _arr_time: 0
            };

            ret.push(_row);
        }

        const _lft_sec = convertTimeString2Second(row.lefttime);
        if(_lft_sec > 0) _row._lft_time = _lft_sec;

        const _arr_sec = convertTimeString2Second(row.arrivetime);
        if(_arr_sec > 0) _row._arr_time = _arr_sec;
      }
    }

    for(const row of ret) {
      const _prev = ret.find(expect => {
        const diff = row._lft_time - expect._arr_time;
        return (diff > 0 && diff <= 120);
      });
      if(typeof _prev !== 'undefined') row.prev_train = _prev.train_num;

      const _next = ret.find(expect => {
        const diff = expect._lft_time - row._arr_time;
        return (diff > 0 && diff <= 120);
      });
      if(typeof _next !== 'undefined') row.next_train = _next.train_num;
    }

    for(const row of ret) {
      if(row.next_train !== -1) row.dest = (row.train_num % 2 === 0) ? '내선순환' : '외선순환';
    }

    for(const row of ret) {
      delete row._arr_time;
      delete row._lft_time;
    }

    return ret;
  } catch(err) {
    console.log('****** ERROR ******');
    console.log(err);
    return null;
  }
}

const convertTimeString2Second = time_string => {
  if(time_string.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)) {
    const _t = time_string.split(':');
  
    const h = parseInt(_t[0]) * 60 * 60;
    const m = parseInt(_t[1]) * 60;
    const s = parseInt(_t[2]);

    return (h + m + s);
  } else {
    return -1;
  }
}

exports.parse = parse;