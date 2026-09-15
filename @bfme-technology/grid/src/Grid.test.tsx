import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Grid } from './Grid';

describe('Grid Component', () => {
  const columnDefs = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' }
  ];

  const rowData = [
    { id: '1', name: 'Test 1' },
    { id: '2', name: 'Test 2' }
  ];

  it('renders the Grid with data', () => {
    render(<Grid columnDefs={columnDefs} rowData={rowData} />);
    expect(screen.getByText('Test 1')).toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
  });

  it('handles row clicks', () => {
    const handleRowClick = jest.fn();
    render(<Grid columnDefs={columnDefs} rowData={rowData} onRowClick={handleRowClick} />);
    
    const rowElement = screen.getByText('Test 1').closest('tr');
    expect(rowElement).not.toBeNull();
    fireEvent.click(rowElement!);
    
    expect(handleRowClick).toHaveBeenCalledTimes(1);
    expect(handleRowClick).toHaveBeenCalledWith(rowData[0]);
  });
});
