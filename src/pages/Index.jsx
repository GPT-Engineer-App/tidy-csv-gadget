import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { parse } from 'papaparse';
import { CSVLink } from 'react-csv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const CSVEditor = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState('');

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFileName(file.name);

    parse(file, {
      complete: (results) => {
        setHeaders(results.data[0]);
        setData(results.data.slice(1));
      },
      header: false,
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleCellEdit = (rowIndex, columnIndex, value) => {
    const newData = [...data];
    newData[rowIndex][columnIndex] = value;
    setData(newData);
  };

  const addRow = () => {
    setData([...data, Array(headers.length).fill('')]);
  };

  const deleteRow = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  return (
    <div className="container mx-auto p-4 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-4 text-primary">CSV Editor</h1>
      
      <div {...getRootProps()} className="border-2 border-dashed border-primary rounded-lg p-8 mb-4 text-center cursor-pointer bg-secondary">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the CSV file here ...</p>
        ) : (
          <p>Drag 'n' drop a CSV file here, or click to select a file</p>
        )}
      </div>

      {data.length > 0 && (
        <>
          <div className="mb-4 space-x-2">
            <Button onClick={addRow} className="bg-primary text-primary-foreground hover:bg-primary/90">Add Row</Button>
            <CSVLink data={[headers, ...data]} filename={`edited_${fileName}`}>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Download CSV</Button>
            </CSVLink>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Input
                          value={cell}
                          onChange={(e) => handleCellEdit(rowIndex, cellIndex, e.target.value)}
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button variant="destructive" onClick={() => deleteRow(rowIndex)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

const Index = () => {
  return <CSVEditor />;
};

export default Index;
