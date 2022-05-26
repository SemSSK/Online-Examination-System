


 import * as React from 'react';
 import Paper from '@mui/material/Paper';

 import {
     Column,
     FilteringState, GroupingState,
     IntegratedFiltering, IntegratedGrouping, IntegratedPaging, IntegratedSelection, IntegratedSorting,
     PagingState, SelectionState, SortingState, DataTypeProvider, DataTypeProviderProps,
 } from '@devexpress/dx-react-grid';
 import {
     DragDropProvider,
     Grid, GroupingPanel, PagingPanel,
     Table, TableFilterRow, TableGroupRow,
     TableHeaderRow, TableSelection, Toolbar,
 } from '@devexpress/dx-react-grid-material-ui';
 import formStyle from "./formStyle.module.css";
 import axios from "axios";
 import tableStyle from "../AffectationModule/tableStyle.module.css";
 import ArrowBackIcon from '@mui/icons-material/ArrowBack';
 import IconButton from "@mui/material/IconButton";




 const getStudents = (setRows) => {
     const url = "http://localhost:8080/admin/etudiant";
     axios.get(url, { withCredentials: true })
         .then(response => {
             if (response.status !== 200) {
                 throw response.data;
             }
             console.log(response.data);
             const data = response.data;
             setRows(data);

         })
         .catch(error => {
             console.log(error);
         });
 }


 const StudentSelections = ({setNewEtudiantAffectationList,handleExpandClick,expanded}) => {

     const [columns] = React.useState([
         { name: 'lastName', title: 'last Name' },
         { name: 'name', title: 'First Name' },
         { name: 'userId', title: 'Card N°=' },
         { name: 'niveau', title: 'Year' },
         { name: 'section', title: 'Section' },
         { name: 'groupe', title: 'Group' },
     ]);
     const [tableGroupColumnExtension] = React.useState([
         { columnName: 'name', groupingEnabled: false },
         { columnName: 'lastName', groupingEnabled: false },
         { columnName: 'userId', groupingEnabled: false },
         { columnName: 'level', groupingEnabled: true },
     ]);
     const [rows,setRows] = React.useState([]);
     const [pageSizes] = React.useState([5, 10, 15]);
     const [selection, setSelection] = React.useState([]);


     React.useEffect(() => {
         let newAffectedList = [];
         console.log(selection)
         selection.forEach((affectation)=> {
             newAffectedList =  [...newAffectedList, rows[affectation]];
         })
         setNewEtudiantAffectationList(newAffectedList);
     },[selection])


     React.useEffect(() => {
         console.log("getting students")
         getStudents(setRows);
         console.log(rows);
     },[])





     return (
         <div className={formStyle.affectationForm}>
            <Paper elevation={3} sx={{borderRadius: 0, height: 710}}>
                <div className={formStyle.formContainer}>
                     <div className={tableStyle.pageHeader}>
                         <IconButton onClick={handleExpandClick}
                                     aria-expanded={expanded}
                                     aria-label="show more"
                         >
                             <ArrowBackIcon style={{ fontSize: 35 }}/>
                         </IconButton>
                        <h1 className={tableStyle.pageHeaderTitle} >
                            Selectionner Les Etudiants :
                        </h1>
                     </div>
                     <Grid
                         rows={rows}
                         columns={columns}
                     >
                         <FilteringState

                         />
                         <SortingState
                             defaultSorting={[
                                 { columnName: 'niveau', direction: 'asc' },
                                 { columnName: 'section', direction: 'asc' },
                                 { columnName: 'groupe', direction: 'asc' },
                                 { columnName: 'lastName'},
                             ]}
                         />

                         <SelectionState
                             selection={selection}
                             onSelectionChange={setSelection}
                         />

                         <GroupingState
                             defaultGrouping={[
                                 { columnName: 'niveau' },
                                 { columnName: 'section' },
                                 {columnName: 'groupe'},
                             ]}
                             columnExtensions={tableGroupColumnExtension}
                         />
                         <PagingState />

                         <IntegratedGrouping />
                         <IntegratedFiltering />
                         <IntegratedSorting />
                         <IntegratedPaging />
                         <IntegratedSelection />



                         <DragDropProvider />

                         <Table />
                         <TableSelection showSelectAll={true} selectByRowClick />

                         <TableHeaderRow showSortingControls={true} showGroupingControls />
                         <TableFilterRow showFilterSelector={true} />
                         <PagingPanel pageSizes={pageSizes} />
                         <TableGroupRow />
                         <Toolbar />
                         <GroupingPanel showGroupingControls />
                     </Grid>
                </div>
         </Paper>
         </div>
     );
 };




export default StudentSelections;