import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {

    const isEmpty = (obj) => {
		for(var key in obj) {
			if(obj.hasOwnProperty(key))
				return false;
		}
		return true;
	}

	let div_boxes = [];
	let div_error = [];

	if(!isEmpty(box))
	{
		div_boxes = box.map( (element, index) => {
			return <div key={index} className='bounding-box' style={{top: element.topRow, right: element.rightCol , bottom: element.bottomRow , left: element.leftCol}}></div>
		})
	}
	else
	{
		div_error = <div className="alert alert-danger">Image invalide</div>
	}
    return (			
			imageUrl && 
			(
				<div className='center ma'>
					{div_error ? div_error : ''}
					<div className='absolute mt2'>
						<img id='inputimage' src={imageUrl} alt='' width='500px' heigh='auto'/>
						{div_boxes ? div_boxes : div_error}
					</div>
				</div>
			) 
    )
}

export default FaceRecognition;