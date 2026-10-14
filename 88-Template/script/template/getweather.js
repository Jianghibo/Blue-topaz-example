async function getWeather(city){
	if(!city) city = "杭州";
	let key='dc0f31ac6f37484f88e3e7d45b84e403'; //尽量换成自己申请的key以免接口失效https://console.qweather.com
	try {
		let location = await searchCity(city,key);
		if(!location || location === -1 || !location.id) return await getWWeather(city);
		let weather = await getQWeather(location.id,key);
		if(weather=='-1' || !weather) return await getWWeather(city);
		let air = await getair(location.id,key);
		let windyspeed = Math.max(weather[0].windSpeedDay, weather[0].windSpeedNight);
		let windydesc = '';
		if(windyspeed<12)
		{
		 windydesc = "微风习习";
		}else if(windyspeed<39)
		{
		 windydesc = "清风徐徐";	
		}else 
			windydesc = "有"+weather[0].windDirDay+"风出没，风力"+weather[0].windScaleDay+'级';	
		let today = weather[0];
		let airText = air && air.category ? air.category + " " : "";
		let moon = today.moonPhase ? today.moonPhase.replace(/[\u4e00-\u9fa5]/g,"") : "";
		return `${city} ${today.textDay}，${today.tempMin}~${today.tempMax}℃ ${airText}${windydesc}${moon}`;
	} catch (error) {
		return await getWWeather(city);
	}
}

function weatherText(code) {
	const n = Number(code);
	if (n === 113) return "晴";
	if (n === 116) return "多云";
	if (n === 119 || n === 122) return "阴";
	if (n === 143 || n === 248 || n === 260) return "有雾";
	if (n >= 200 && n < 230) return "雷雨";
	if (n >= 263 && n < 320) return "有雨";
	if (n >= 176) return "阵雨";
	return "";
}
function weatherIcon(code) {
	const n = Number(code);
	if (n === 113) return "☀️";
	if (n === 116) return "🌤️";
	if (n === 119 || n === 122) return "☁️";
	if (n >= 200 && n < 230) return "⛈️";
	if (n >= 263 && n < 368) return "🌧️";
	if (n >= 176) return "🌦️";
	return "🌡️";
}
function windText(dir) {
	const map = { N: "北", NE: "东北", E: "东", SE: "东南", S: "南", SW: "西南", W: "西", NW: "西北", NNE: "东北", ENE: "东北", ESE: "东南", SSE: "东南", SSW: "西南", WSW: "西南", WNW: "西北", NNW: "西北" };
	return (map[dir] || "") + "风";
}

//wttr 天气入口。和风账号停用时用这一路，保证新建日记仍能写入天气。
async function getWWeather(city)
 {
	if(!city) city = "杭州";
	const res = await fetch("https://wttr.in/" + encodeURIComponent(city) + "?format=j1");
	const data = await res.json();
	const current = data.current_condition[0];
	const today = data.weather[0];
	return `${city} ${weatherIcon(current.weatherCode)}${weatherText(current.weatherCode)}，${today.mintempC}~${today.maxtempC}℃ ${windText(current.winddir16Point)} ${current.windspeedKmph}km/h`;
 }
// 和风天气入口获取天气信息
async function getQWeather(locationId,key){
	

	days=1;
	console.log('locationId:'+locationId);
	let weatherUrl = `https://devapi.qweather.com/v7/weather/3d?location=${locationId}&key=${key}`;
	let wUrl = new URL(weatherUrl);
 	const res = await request({
		url: wUrl.href,
		method: "GET",
 	});
	
	let data = JSON.parse(res);
	if(data.code!="200"){
	 	return -1;
 	}
	let weather= data.daily.slice(0,1);
	
	//添加表情
	for(let i=0;i<days;i++){
		let textDay = weather[i].textDay;
		let moon = weather[i].moonPhase;
		if(textDay.includes("雨")){
			weather[i].textDay="🌧"+textDay;
		}else if(textDay.includes("云")){
			weather[i].textDay="⛅"+textDay;
		}else if(textDay.includes("晴")){
			weather[i].textDay="🌞"+textDay;
		}else if(textDay.includes("雪")){
			weather[i].textDay="❄"+textDay;
		}else if(textDay.includes("阴")){
			weather[i].textDay="🌥"+textDay;
		}else if(textDay.includes("风")){
			weather[i].textDay="🍃"+textDay;
		}else if(textDay.includes("雷")){
			weather[i].textDay="⛈"+textDay;
		}else if(textDay.includes("雾")){
			weather[i].textDay="🌫"+textDay;
		}
		switch(moon){
			case "新月":
				weather[i].moonPhase="🌑"+moon;
				break;
			case "峨眉月":
				weather[i].moonPhase="🌒"+moon;
				break;
			case "朔月":
				weather[i].moonPhase="🌑"+moon;
				break;
			case "娥眉月":
				weather[i].moonPhase="🌒"+moon;
				break;
			case "上弦月":
				weather[i].moonPhase="🌓"+moon;
				break;
			case "盈凸月":
				weather[i].moonPhase="🌔"+moon;
				break;
			case "满月":
				weather[i].moonPhase="🌕"+moon;
				break;
			case "亏凸月":
				weather[i].moonPhase="🌖"+moon;
				break;
			case "下弦月":
				weather[i].moonPhase="🌗"+moon;
				break;
			default:
				weather[i].moonPhase="🌘"+moon;
		}
	}
	return weather;
}
// 获取空气质量信息
async function getair(locationId,key){

	let weatherUrl = `https://devapi.qweather.com/v7/air/now?location=${locationId}&key=${key}`;
	let wUrl = new URL(weatherUrl);
 	const res = await request({
		url: wUrl.href,
		method: "GET",
 	});
	
	let data = JSON.parse(res);
	if(data.code!="200"){
	 	return -1;
 	}
	let air= data.now;
	return air;
	
}

//查询位置
async function urlGet(url) {
console.log(url);
  let finalURL = new URL(url);
  const res = await request({
    url: finalURL.href,
    method: "GET",
    cache: "no-cache",
    headers: {
      'Content-Type': 'application/json;charset=gb2312',
	  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.100.4758.11 Safari/537.36'
    },
  });
  
  return res;

}
async function getpos(key) {
let result = await urlGet('http://whois.pconline.com.cn/ipJson.jsp?json=true')
 result = JSON.parse(result);
	let city=result.cityCode;
return await searchCity(city,key);
}
//查询城市ID
async function searchCity(city,key){
	let searchUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${city}&key=${key}&number=1`;
	let sUrl = new URL(searchUrl);
	const res = await request({
		url: sUrl.href,
		method: "GET",
 	});
	let data = JSON.parse(res);
	if(data.code=="200"){
	return data.location[0];
 }
 	return -1;
}

module.exports =  getWeather