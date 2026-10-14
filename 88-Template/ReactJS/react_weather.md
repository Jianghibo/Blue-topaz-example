---
defines-react-components: true
---

```jsx:component:Weather
// tianqiapi.com 已无法访问。wttr.in 的网页是黑底，所以只取数据，按侧边栏文字显示。
const city = (props.src || "").trim();
const [info, setInfo] = useState(null);

function weatherText(code) {
	const n = Number(code);
	if (n === 113) return "晴";
	if (n === 116) return "多云";
	if (n === 119 || n === 122) return "阴";
	if (n === 143 || n === 248 || n === 260) return "有雾";
	if (n >= 200 && n < 230) return "雷雨";
	if (n >= 227 && n < 263) return "有雪";
	if (n >= 263 && n < 320) return "有雨";
	if (n >= 320 && n < 368) return "雨夹雪";
	if (n >= 386) return "雷雨";
	if (n >= 176) return "阵雨";
	return "天气";
}

function windText(dir) {
	const map = {
		N: "北", NNE: "东北", NE: "东北", ENE: "东北",
		E: "东", ESE: "东南", SE: "东南", SSE: "东南",
		S: "南", SSW: "西南", SW: "西南", WSW: "西南",
		W: "西", WNW: "西北", NW: "西北", NNW: "西北"
	};
	return (map[dir] || dir) + "风";
}
function weatherIcon(code) {
	const n = Number(code);
	if (n === 113) return "☀️";
	if (n === 116) return "🌤️";
	if (n === 119 || n === 122) return "☁️";
	if (n === 143 || n === 248 || n === 260) return "🌫️";
	if (n >= 200 && n < 230) return "⛈️";
	if (n >= 227 && n < 263) return "🌨️";
	if (n >= 263 && n < 320) return "🌧️";
	if (n >= 320 && n < 368) return "🌨️";
	if (n >= 368 && n < 386) return "🌧️";
	if (n >= 386) return "⛈️";
	if (n >= 176) return "🌦️";
	return "🌡️";
}

useEffect(() => {
	let alive = true;
	fetch("https://wttr.in/" + encodeURIComponent(city) + "?format=j1")
		.then((res) => res.json())
		.then((data) => {
			if (!alive) return;
			const today = data.weather[0];
			const current = data.current_condition[0];
			const labels = ["今天", "明天", "后天"];
			setInfo({
				name: city || data.nearest_area[0].areaName[0].value,
				icon: weatherIcon(current.weatherCode),
				desc: weatherText(current.weatherCode),
				temp: current.temp_C,
				feels: current.FeelsLikeC,
				range: today.mintempC + "°～" + today.maxtempC + "°",
				humidity: current.humidity,
				wind: windText(current.winddir16Point) + " " + current.windspeedKmph + " km/h",
				uv: today.uvIndex,
				precip: current.precipMM,
				days: data.weather.slice(0, 3).map((day, index) => ({
					label: labels[index],
					icon: weatherIcon(day.hourly[4].weatherCode),
					range: day.mintempC + "°～" + day.maxtempC + "°"
				}))
			});
		})
		.catch(() => {
			if (alive) setInfo(null);
		});
	return () => {
		alive = false;
	};
}, [city]);

if (!info) {
	return <div className="sidebar-weather sidebar-weather--empty">天气加载中</div>;
}

return (
	<div className="sidebar-weather">
		<div className="sidebar-weather__now">
			<div className="sidebar-weather__temp">{info.icon} {info.temp}°</div>
			<div className="sidebar-weather__summary">
				<div>{info.name} · {info.desc}</div>
				<div>体感 {info.feels}° · 今日 {info.range}</div>
			</div>
		</div>
		<div className="sidebar-weather__facts">
			<span>湿度 {info.humidity}%</span>
			<span>{info.wind}</span>
			<span>紫外线 {info.uv}</span>
			<span>降水 {info.precip} mm</span>
		</div>
		<div className="sidebar-weather__days">
			{info.days.map((day) => (
				<div key={day.label} className="sidebar-weather__day">
					<div>{day.label}</div>
					<div>{day.icon}</div>
					<div>{day.range}</div>
				</div>
			))}
		</div>
	</div>
);
```

```jsx::Weather

```

