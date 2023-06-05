import React from "react";
import * as AiIcons from "react-icons/ai"
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend 
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function Earnings(props) {
    const [data, setData] = React.useState()
    const [dataMonth, setDataMonth] = React.useState({});
    const [dataYear, setDataYear] = React.useState({});
    const [numJobs, setNumJobs] = React.useState()
    const [yearData, setYearData] = React.useState()

    const [selectedYears, setSelectedYears] = React.useState()
    const [selectedYear, setSelectedYear] = React.useState()

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "June",
        "July", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
    let years = []
    React.useEffect(() => {
        if (props.contracts) {
          const newData = props.contracts.map(contract => {
            for (let i = 0; i < props.contracts.length; i++) {
                const date = new Date(props.contracts[i].signed_at);
                const year = date.getFullYear();
                if (!years.includes(year)) {
                    years.push(year);
                  }
            }
            console.log(years)
            setSelectedYears(years)
            const monthlyEarn = {
              amount: parseFloat(contract.total_payment_amount),
              month: "",
              year: ""
            };
      
            const date = new Date(contract.signed_at);
            const month = date.getMonth() + 1;

            const monthName = monthNames[month - 1];
            const year = date.getFullYear();
      
            return {
              ...monthlyEarn, // Create a new object with existing values
              month: monthName,
              year: year
            };
          });
      
          setData(newData);

          
        const dataMonth = newData.reduce((acc, earning) => {
            const { month, amount } = earning;
            if (acc[month]) {
            acc[month] += amount;
            } else {
            acc[month] = amount;
            }
            return acc;
        }, {});
    
        setDataMonth(dataMonth);
    
        const dataYear = newData.reduce((acc, earning) => {
            const { year, amount } = earning;
            if (acc[year]) {
            acc[year] += amount;
            } else {
            acc[year] = amount;
            }
            return acc;
        }, {});
    
        setDataYear(dataYear);

        const yearData = newData.reduce((acc, earning) => {
            const { month, amount, year } = earning;
          
            // Check if the year already exists in the accumulator
            const existingYear = acc.find(item => item.year === year);
            if (existingYear) {
              // Check if the month already exists in the year object
              const existingMonth = existingYear.data.find(item => item.month === month);
              if (existingMonth) {
                existingMonth.amount += amount;
              } else {
                // Month doesn't exist, add it to the year object
                existingYear.data.push({ month, amount });
              }
            } else {
              // Year doesn't exist, add it to the accumulator
              acc.push({ year, data: [{ month, amount }] });
            }
          
            return acc;
          }, []);

          setYearData(yearData)
        }

      }, [props.contracts]);
      
    React.useEffect(
        () => {
            if (selectedYears && selectedYears.length > 0) {
                let newYear = selectedYears[0]
                console.log(newYear)
                setSelectedYear(newYear);
                console.log(selectedYear)
            }
        },[yearData]
    )
    console.log(selectedYear)
    let newYears = []
    newYears = selectedYears
    console.log(selectedYears)
    console.log(yearData && yearData[0] && yearData[0].data)

      const dataArray = Object.entries(dataMonth).map(([monthYear, amount]) => {
        const [month, year] = monthYear.split('-');
        return { month, year, amount };
      });

      console.log(dataArray)

    function updateValues(event) {
        const {name, value} = event.target
        setSelectedYear(value)
        console.log(selectedYear)
    }

    return (
        <div className="job">
            <div className="side">
                <AiIcons.AiOutlineClose className="close" onClick={props.handleClick}/>
            </div>
            <div className="job_display">
                <div className="header">
                    <h2>Your Earnings</h2>
                </div>
                <div>
                {
                data && selectedYear ?
                <div>
                    <div>
                        <h3>Total Per Month</h3>
                        <h4>Choose Year:</h4>
                        <form>
                            <select 
                                id = "selectedYear" 
                                name="selectedYear" 
                                value={selectedYear} 
                                onChange= {updateValues}
                            >
                                {data && selectedYears.map((year) => {
                                    console.log(year)
                                    return(
                                        <option value={year}>
                                            {year}
                                        </option>
                                    )
                                })}
                            </select>
                        </form>
                        <div className="App"style={{ width: "700px", height: "400px" }} >
                            <Bar 
                                data={{
                                    labels: yearData.find(item => item.year === selectedYear)?.data.map(item => item.month) || [],
                                    datasets: [
                                    {
                                        label: "Amount in Kshs.",
                                        data: yearData.find(item => item.year === selectedYear)?.data.map(item => item.amount) || [],
                                        backgroundColor: "rgba(255, 99, 132)"
                                    }
                                    ]
                                }}
                                
                                // data = {{
                                //     labels: monthNames,
                                //     datasets: [
                                //         {
                                //             label: "Amount in Kshs.",
                                //             data: dataMonth,
                                //             backgroundColor: "rgba(255, 99, 132)"
                                //         }
                                //     ]
                                // }}
                            /> 
                        </div>
                    </div>
                    <div>
                        <h3>Total Per Year</h3>
                        <div className="App" style={{ width: "600px", height: "400px" }}>
                            <Bar 
                                data = {{
                                    labels: data && years,
                                    datasets: [
                                        {
                                            label: "Amount in Kshs.",
                                            data: dataYear,
                                            backgroundColor: "rgba(255, 99, 132)"
                                        }
                                    ]
                                }}
                            /> 
                        </div>                       
                    </div>
                </div>
                :
                <div>
                    <h3 style = {{fontWeight : "normal"}}>You have not signed any contract yet to get earnings!</h3>
                </div>
                }
                </div>
            </div>
        
        </div>
    )
}