const { parse } = require('csv-parse'); //to deal with Stream of data
const fs = require('fs');  // to process CSV file as a Stream

const habitablePlanets = [];

function isHabitable(data)
{
    return data['koi_disposition'] === "CONFIRMED" 
    && data['koi_insol']>0.36 && data['koi_insol']<1.11 //Temperature
    && data['koi_prad']<1.6;    //Planetary Rasius
}

fs.createReadStream('kepler_data.csv')
    .pipe(parse({
        comment: '#',
        columns: true,
    }))      /*  combining the input data with parse and outputting it as a result
                            of both the pipe parse
                            and fs.createReadStream  */
    .on('data', (data) =>{
        if(isHabitable(data))
        {
        habitablePlanets.push(data);
        }
    })
    .on('end', ()=>{
        console.log(`${habitablePlanets.length} other planets are just like Earth!\nThey are`);
        console.log(habitablePlanets.map((planet) => {
            return planet['kepler_name'];
        }));

    })
    .on('error',(err)=>{
        console.log(err);
    });