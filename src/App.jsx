import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import DataTable from './dataTable';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [smeData, setSmeData] = useState([]);
  const [cm52Data, setCm52Data] = useState([]);
  const [smeColumns, setSmeColumns] = useState([]);
  const [cm52Columns, setCm52Columns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch SME data
        const smeResponse = await axios.get(`${process.env.PORTAL_HOST_URL}/api/sme-data`);
        Papa.parse(smeResponse.data, {
          header: true,
          skipEmptyLines: true,
          // Skip the first two lines (disclaimer and effective date)
          transformHeader: header => header.replace(/"/g, '').trim(),
          complete: (results) => {
            const cleanedData = results.data.map(row => {
              const cleanedRow = {};
              Object.keys(row).forEach(key => {
                cleanedRow[key] = row[key].replace(/"/g, '').trim();
              });
              return cleanedRow;
            });
            setSmeData(cleanedData);

            const columns = [
              { Header: 'MARKET', accessor: 'MARKET' },
              { Header: 'SERIES', accessor: 'SERIES' },
              { Header: 'SYMBOL', accessor: 'SYMBOL' },
              { Header: 'SECURITY', accessor: 'SECURITY' }
            ];
            setSmeColumns(columns);
          }
        });

        // Fetch CM52 data
        const cm52Response = await axios.get(`${process.env.PORTAL_HOST_URL}/api/sme-data`);
        Papa.parse(cm52Response.data, {
          header: true,
          skipEmptyLines: true,
          transformHeader: header => header.replace(/"/g, '').trim(),
          complete: (results) => {
            const cleanedData = results.data.map(row => {
              const cleanedRow = {};
              Object.keys(row).forEach(key => {
                cleanedRow[key] = row[key].replace(/"/g, '').trim();
              });
              return cleanedRow;
            });
            setCm52Data(cleanedData);

            // Define columns for CM52 tables
            const columns = [
              { Header: 'SYMBOL', accessor: 'SYMBOL' },
              { Header: 'SERIES', accessor: 'SERIES' },
              { Header: '52 Week High', accessor: 'Adjusted 52_Week_High' },
              { Header: '52 Week High Date', accessor: '52_Week_High_Date' }
            ];

            setCm52Columns(columns);
          },
          // Skip the first two lines by processing data before parsing
          beforeFirstChunk: chunk => chunk.split('\n').slice(2).join('\n')
        });
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mb-4">
          <DataTable columns={smeColumns} data={smeData} title="SME Data" />
        </div>
        <div className="col-md-6 mb-4">
          <DataTable columns={cm52Columns} data={cm52Data} title="CM52 Data" />
        </div>
      </div>
    </div>
  );
};

export default App;
