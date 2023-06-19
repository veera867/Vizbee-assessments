import Papa from 'papaparse';

const processCSVData = (csvData) => {
    // Parse the CSV data using Papa Parse
    const parsedData = Papa.parse(csvData).data;

    // Extract the necessary information from the parsed data
    const extractedData = [];

    // Process the parsed data and extract the necessary fields (slno, question, answer, importance)
    // and create an object for each row in the CSV
    for (const row of parsedData) {
        const extractedRow = {
          slno: row[0], // Assuming the first column contains slno
          question: row[1], // Assuming the second column contains the question
          answer: row[2], // Assuming the third column contains the answer
          importance: row[3], // Assuming the fourth column contains the importance
        };
        extractedData.push(extractedRow);
    }   

    return extractedData;
};

export default processCSVData;