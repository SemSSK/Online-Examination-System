import React,{useState,useEffect} from "react"
import AffectationForum from "./AffectationForum"
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import tableStyle from "../AdminStyle/tableStyle.module.css";
import axios from 'axios';

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#012b39", //theme.palette.common.black,
        color: theme.palette.common.white,
        fontSize: 16,
        letterSpacing: "2px",
        textTransform: "uppercase",
        borderRight: "1px solid rgba(116, 202, 252,.3)"
        },
        [`&.${tableCellClasses.head} .Mui-active , &.${tableCellClasses.head} .Mui-active svg`]: {
            color: "rgba(116, 202, 252,.9) !important",
           
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        borderBottom: "1px solid #36404319",
        textTransform: "uppercase"
        },
        [`&.${tableCellClasses.body}:nth-child(4)`]:{
            borderRight: "none",
            textTransform: "none"
        },
        [`&.${tableCellClasses.body}:last-child`]:{
            borderRight: "none"
        }
    }));
  
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
    

        '&:nth-of-type(odd) td, &:nth-of-type(odd) th': {
            backgroundColor:"white"
        },
        '&:nth-of-type(even) td, &:nth-of-type(even) th': {
            backgroundColor:"white"
        },
        '&:last-child td, &:last-child th': {
            borderBlock: "none",
        },
    }));

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
        return -1;
        }
        if (b[orderBy] > a[orderBy]) {
        return 1;
        }
        return 0;
    }
  
    function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }
  
 

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) {
            return order;
          }
          return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const headCells =[{id:"nomModule",label:"Module"}, {id:"enseignant",label:"enseignant"}, {id:"type",label:"type"}, {id:"affectationDate",label:"affectation Date"},{id:"actions",label:"actions"}]
    
    function EnhancedTableHead(props) {
        const {  order, orderBy,  onRequestSort } =
          props;
        const createSortHandler = (property) => (event) => {
          onRequestSort(event, property);
        };
      
        return (
          <TableHead>
            <TableRow>
              
              {headCells.map((headCell) => (
                <StyledTableCell
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    className={tableStyle.th_Sorting}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                    ) : null}
                  </TableSortLabel>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
        );
    }

    EnhancedTableHead.propTypes = {
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired
    };



export default function AffectationsTable() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [enseignements,setEnseignements] = useState([]);
    

    useEffect(() => {
        const fetchEnseignements = async ()=> {
            try {
                const response = await axios.get('http://localhost:8080/admin/affectationModule', { withCredentials: true })
                if(response && response.data){
                    setEnseignements(response.data);
                }
            } catch(err){
                if(err.response){
                    console.log(err.response.data);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                }else{
                    console.log(`Error: ${err.message}`);
                }

            }
        }

        fetchEnseignements();
    },[])

    async function deleteAffectation(moduleId, enseignantId) {

        const url = `http://localhost:8080/admin/affectationModule/delete/${moduleId}/${enseignantId}`
        try{
            await axios.delete(url, { withCredentials: true })
            const newList = enseignements.filter(enseignement =>
            !(
                enseignement.affectationModuleId.moduleId === moduleId 
                && enseignement.affectationModuleId.enseignantId === enseignantId 
            ))
        
            setEnseignements(newList)
        }catch(err){
            if(err.response){
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            }else{
                console.log(`Error: ${err.message}`);
            }

        }
    }
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
      };

      
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };


    return(
        <section>
            <div className={tableStyle.container}>
                
                <div className={tableStyle.content_box}>
                    <div className={tableStyle.pageHeader}>
                        <h1>Teachings List :</h1>
                    </div>

                    <AffectationForum 
                        enseignements={enseignements} 
                        setEnseignements={setEnseignements}
                    />
                
                    <div>
                            <Paper elevation={4} sx={{ width: '100%', overflow: 'hidden' , border:"1px solid #014055" }}>
                                <TableContainer sx={{ height: 550 }}>
                                    <Table stickyHeader sx={{ minWidth: 700}} aria-label="sticky table">
                                        <EnhancedTableHead
                                            order={order}
                                            orderBy={orderBy}
                                            onRequestSort={handleRequestSort}
                                        />
                                        <TableBody>
                                            {
                                                stableSort(enseignements, getComparator(order, orderBy))
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((enseignement,index) => (
                                                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={index} >
                                            
                                                        <StyledTableCell component="th" scope="row" >{enseignement.module.nomModule}</StyledTableCell>
                                                        <StyledTableCell >{enseignement.enseignant.lastName+" "+enseignement.enseignant.name}</StyledTableCell>
                                                        <StyledTableCell >{enseignement.type}</StyledTableCell>
                                                        <StyledTableCell >{enseignement.affectationDate}</StyledTableCell>
                                                        <StyledTableCell >
                                                            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-evenly"}}>
                                                                <IconButton sx={{border: "1px solid #005c75", boxShadow:" 2px 2px 5px rgba(0, 0, 0, .3)"}}
                                                                onClick={()=> deleteAffectation(enseignement.affectationModuleId.moduleId, enseignement.affectationModuleId.enseignantId)}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </div>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    sx={{
                                        backgroundColor: "#014055",
                                        color: "white",
                                        fill:'white'
                                    }}
                                    className={tableStyle.tableFooter}
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={enseignements.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                    </div>
                </div>
            </div>
        </section>

                
    )

}


