import React from "https://cdn.skypack.dev/react@latest";
import ReactDOM from "https://cdn.skypack.dev/react-dom@latest";

import './index.css'

import defaultData from './data.json'

const calculateGrade = (data) => {
	return (
			data.scores.Knowledge * data.weights[data.selected].Knowledge + 
			data.scores.Thinking * data.weights[data.selected].Thinking + 
			data.scores.Application * data.weights[data.selected].Application + 
			data.scores.Communication * data.weights[data.selected].Communication
	).toPrecision(3)
}

const App = () => {
	const [data, setData] = React.useState({
		weights: {
			...defaultData.weights
		},
		scores: {
			Knowledge: .9,
			Thinking: .8,
			Application: .7,
			Communication: 1
		},
		overall: 0,
		selected: "Physics",
		lastUpdate: Date.now()
	});
	
	
	const categories = ["Knowledge", "Thinking", "Application", "Communication"]
	const categoryEls = categories.map(name => <Category name={name} data={data} setData={setData} key={"category-" + name } />)
	
	const options = Object.keys(defaultData.weights)
		.map(name => <Option name={name} data={data} setData={setData} />)
	
	React.useEffect(() => {
		data.overall = calculateGrade(data)
		setData(data)
	}, [data])
	
	const setWeights = (name) => {
		const newData = {...data}
		newData.selected = name
		setData(newData)
	}
	
	return (
		<main>
			<h1>Ontario Grade Calculator</h1>
			Weights <br />
			<select onChange={event => setWeights(event.target.value)}>
				{ options }
			</select>
			<br /> <br />
			{ categoryEls }
			<br />
			<b>Overall <br /> {calculateGrade(data)}%</b>
		</main>
	);
};

const Option = ({ name }) => {
	return <option name={name}>{name}</option>;
};

const Category = ({ data, setData, name }) => {
	const marks = React.useRef()
	const outOf = React.useRef()
	
	const mutate = () => {
		const newData = {...data}
		newData.scores[name] = Number(marks.current.value) / Number(outOf.current.value)
		newData.lastUpdate = Date.now()
		setData(newData)
	}
	
	const rand = Math.round(Math.random() * 20)
	return (
		<div class="category">
			<span class="name">{name}</span>
			<input type="number" placeholder={rand} onChange={ mutate } ref={ marks } />
		  /
			<input type="number" placeholder={20} onChange={ mutate } ref={ outOf }/>
			at
			<input type="number" value={data.weights[data.selected][name]} />%
		</div>
	);
};

ReactDOM.render(<App />, document.querySelector(".app"));
