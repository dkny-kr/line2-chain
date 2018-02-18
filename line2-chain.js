'use strict';

const ALLOW_DAYTYPE = ['weekday', 'saturday', 'holiday'];
const http = require('http');
const xml2js = require('xml2js');
const XMLParser = new xml2js.Parser({ trim: true, normalizeTags: true, explicitArray: false });
const parser = require('./parser');
const API_SERVER_URL = 'openapi.seoul.go.kr';
const API_SERVER_PORT = 8088;
let API_KEY = '';
let result = [];

exports.config = api_key => {
  API_KEY = api_key;
};

const getJSONData = (day_type, direction) => {
  return new Promise((resolve, reject) => {
    getXMLData(ALLOW_DAYTYPE.indexOf(day_type) + 1, direction)
      .then(xml => {
        return convertXMLtoJSON(xml);
      })
      .then(json => {
        const data = parser.parse(json);
        if(data) {
          resolve(data);
        } else {
          return Promise.reject('ParseXMLtoJSONError');
        }
      })
      .catch(e => {
        reject(e);
      })
  });
};

const getChain = (day_type) => {
  return new Promise((resolve, reject) => {
    getJSONData(day_type, 1)
      .then(json => {
        result = result.concat(json);
        return getJSONData(day_type, 2);
      })
      .then(json => {
        result = result.concat(json);
        resolve(result);
      })
      .catch(e => {
        reject(e);
      });
    });
};

const getXMLData = (day_type, direction) => {
  return new Promise((resolve, reject) => {
    http.get({
      hostname: API_SERVER_URL,
      port: API_SERVER_PORT,
      path: `/${API_KEY}/xml/SearchSTNTimeTableByFRCodeService/1/1000/211/${day_type}/${direction}`,
      agent: false
    }, res => {
      if(res.statusCode !== 200) {
        res.resume();
        reject(`ResponseCode${res.statusCode}Error`);
      }

      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => { resolve(data); });
    })
    .on('error', e => {
      reject(e);
    });
  });
};

const convertXMLtoJSON = xml => {
  return new Promise((resolve, reject) => {
    XMLParser.reset();
    XMLParser.parseString(xml, (err, result) => {
      if(!err) {
        try {
          resolve(JSON.parse(JSON.stringify(result)));
        } catch(e) {
          reject(e);
        }
      } else {
        reject(err);
      }
    });
  })
};

exports.getChain = getChain;