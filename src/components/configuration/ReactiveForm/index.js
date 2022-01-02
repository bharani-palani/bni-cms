import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import md5 from 'md5';
import helpers from '../../../helpers';

function ReactiveForm(props) {
	const { structure, numColumns, className, onChange, onSubmit, submitBtnLabel, ...rest } = props;
	const [ data, setData ] = useState(structure);
	const [ eye, setEye ] = useState(false);
	const [ errorIndexes, setErrorIndexes ] = useState([]);

	useEffect(
		() => {
			setData(data);
			const errors = data
				.map((d) => {
					if (d.options) {
						if (d.options.validation) {
							return !new RegExp(d.options.validation).test(d.value) && d.index;
						} else {
							return false;
						}
					} else {
						return false;
					}
				})
				.filter((f) => f);
			setErrorIndexes(errors);
		},
		[ data ]
	);

	const handleChange = (e, index, value) => {
		onChange(index, value);
	};

	const renderCloneTooltip = (props, content, id) => {
		const Html = () =>
			content.length > 1 ? (
				<ul
					style={{
						listStyle: 'decimal',
						padding: '10px',
						textAlign: 'left',
						margin: '5px'
					}}
				>
					{content.map((c) => (
						<li style={{ wordBreak: 'break-all' }} dangerouslySetInnerHTML={{ __html: c }} />
					))}
				</ul>
			) : (
				<div dangerouslySetInnerHTML={{ __html: content[0] }} />
			);
		return (
			<Tooltip id={`tooltip-${id}`} className="in show" {...rest}>
				<Html key={`html-1`} />
			</Tooltip>
		);
	};

	const HelpContent = (props) => {
		const { label, id } = props;
		return (
			<OverlayTrigger placement="top" overlay={renderCloneTooltip(props, label, id)} trigger="click">
				<i className="fa fa-question-circle" />
			</OverlayTrigger>
		);
	};

	const ErrorSpan = (props) => {
		const { label } = props;
		return <div className="text-danger mt-3">{label}</div>;
	};

	const validate = (row, value) => {
		if (row.options.validation) {
			let bErrorIndexes = [ ...errorIndexes ];
			const test = new RegExp(row.options.validation).test(value);
			if (!test) {
				bErrorIndexes.push(row.index);
			} else {
				const myIndex = bErrorIndexes.indexOf(row.index);
				if (myIndex !== -1) {
					bErrorIndexes.splice(myIndex, 1);
				}
			}
			bErrorIndexes = [ ...new Set(bErrorIndexes) ];
			setErrorIndexes(bErrorIndexes);
		}
	};

	const renderElement = (row, key) => {
		switch (row.elementType) {
			case 'hidden':
				return (
					<div key={key}>
						<input id={row.id} type="hidden" defaultValue={row.value} {...rest} />
					</div>
				);
			case 'text':
				return (
					<div className="form-group" key={key}>
						<label htmlFor={row.id}>
							{row.options.required && <sup className="text-danger">*</sup>}
							{row.label} {row.options.help && <HelpContent label={row.options.help} id={row.id} />}
						</label>
						<input
							id={row.id}
							type="text"
							placeholder={row.placeHolder}
							onChange={(e) => handleChange(e, row.index, e.target.value)}
							onKeyUp={(e) => validate(row, e.target.value)}
							className={row.className}
							defaultValue={row.value}
							{...rest}
						/>
						{errorIndexes.includes(row.index) && <ErrorSpan label={row.options.errorMsg} />}
					</div>
				);
			case 'number':
				return (
					<div className="form-group" key={key}>
						<label htmlFor={row.id}>
							{row.options.required && <sup className="text-danger">*</sup>}
							{row.label} {row.options.help && <HelpContent label={row.options.help} id={row.id} />}
						</label>
						<input
							id={row.id}
							type="number"
							placeholder={row.placeHolder}
							onChange={(e) => handleChange(e, row.index, e.target.value)}
							onKeyUp={(e) => validate(row, e.target.value)}
							className={row.className}
							defaultValue={row.value}
							{...rest}
						/>
						{errorIndexes.includes(row.index) && <ErrorSpan label={row.options.errorMsg} />}
					</div>
				);
			case 'textArea':
				return (
					<div className="form-group" key={key}>
						<label htmlFor={row.id}>
							{row.options.required && <sup className="text-danger">*</sup>}
							{row.label} {row.options.help && <HelpContent label={row.options.help} id={row.id} />}
						</label>
						<textarea
							id={row.id}
							rows={row.options.rowLength}
							placeholder={row.placeHolder}
							onChange={(e) => handleChange(e, row.index, e.target.value)}
							onKeyUp={(e) => validate(row, e.target.value)}
							className={row.className}
							{...rest}
							defaultValue={row.value}
						/>
						{errorIndexes.includes(row.index) && <ErrorSpan label={row.options.errorMsg} />}
					</div>
				);
			case 'password':
				return (
					<div className="form-group password" key={key}>
						<label htmlFor={row.id}>
							{row.options.required && <sup className="text-danger">*</sup>}
							{row.label} {row.options.help && <HelpContent label={row.options.help} id={row.id} />}
						</label>
						<input
							id={row.id}
							type={`${!eye ? 'password' : 'text'}`}
							placeholder={row.placeHolder}
							onChange={(e) => handleChange(e, row.index, md5(e.target.value))}
							onKeyUp={(e) => validate(row, e.target.value)}
							className={row.className}
							defaultValue={row.value}
							{...rest}
						/>
						<i onClick={() => setEye(!eye)} className={`eye fa fa-${eye ? 'eye' : 'eye-slash'}`} />
						{errorIndexes.includes(row.index) && <ErrorSpan label={row.options.errorMsg} />}
					</div>
				);
			case 'dropDown':
				return (
					<div className="form-group" key={key}>
						<label htmlFor={row.id}>
							{row.options.required && <sup className="text-danger">*</sup>}
							{row.label} {row.options.help && <HelpContent label={row.options.help} />}
						</label>
						<select
							id={row.id}
							onChange={(e) => {
								validate(row, e.target.value);
								handleChange(e, row.index, e.target.value);
							}}
							className={row.className}
							defaultValue={row.value}
							{...rest}
						>
							<option value="">{row.placeHolder}</option>
							{row.list.map((l, i) => (
								<option key={i} value={l.value}>
									{l.label}
								</option>
							))}
						</select>
						{errorIndexes.includes(row.index) && <ErrorSpan label={row.options.errorMsg} />}
					</div>
				);
			default:
				return <div>Unknown Element</div>;
		}
	};
	return (
		<div className={className}>
			<div className="row">
				{helpers.chunkArray(data, Math.ceil(data.length / numColumns)).map((row, i) => (
					<div key={i} className={`col-md-${Math.ceil(12 / numColumns)}`}>
						{row.map((r, j) => renderElement(r, j))}
					</div>
				))}
				<div className="col-md-12">
					<button
						disabled={errorIndexes.length > 0}
						onClick={() => onSubmit()}
						className="btn btn-bni pull-right"
					>
						{submitBtnLabel}
					</button>
				</div>
			</div>
		</div>
	);
}

ReactiveForm.propTypes = {
	structure: PropTypes.array,
	numColumns: PropTypes.number,
	className: PropTypes.string,
	onChange: PropTypes.func,
	onSubmit: PropTypes.func,
	submitBtnLabel: PropTypes.string
};
ReactiveForm.defaultProps = {
	structure: {
		options: { rowLength: 3 }
	},
	numColumns: 1,
	submitBtnLabel: 'Submit'
};

export default ReactiveForm;