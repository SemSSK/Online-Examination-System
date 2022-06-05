import React, { useState, useEffect } from 'react'
import { useNavigate} from 'react-router-dom';
import EnseignantService from './EnseignantService';
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
import EditIcon from '@mui/icons-material/Edit';
import tableStyle from "../AdminStyle/tableStyle.module.css";


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

const headCells =[{id:"grade",label:"grade"}, {id:"lastName",label:"last Name"}, {id:"firstName",label:"first Name"}, {id:"email",label:"email"},{id:"actions",label:"actions"}]

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

const ListEnseignants = () => {
    const navigate = useNavigate();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [ enseignants , setEnseignants] =useState([]);
    const getAllEnseignants = () =>{
        EnseignantService.getAllEnseignants().then((Response)=>{
            setEnseignants(Response.data)
            console.log(Response.data)
        }).catch(Error=>{
            console.log(Error)
        })

    }
    useEffect(() => {
        getAllEnseignants();
    },[])

    const deleteEnseignant = (userId) =>{
        console.log(userId);
        EnseignantService.deleteEnseignant(userId).then((Response)=>{
            getAllEnseignants();
        }).catch(Error=>{
            console.log(Error)
        })

    }

    const goTo = (url) => {
        navigate(url);
    };
     
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



  return (
     
    <div>


        <div className={tableStyle.container}>
            <div className={tableStyle.content_box + ' '+tableStyle.special}>
                <div className={tableStyle.pageHeader__version2}>
                    <h1>Teachers list :</h1>
                    <a href="/admin/addEnseignant" className={tableStyle.btn + " "+ tableStyle.cta_btn}>+ Add New Teacher</a>
                </div>
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
                                            stableSort(enseignants, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((enseignant,index) => (
                                                <StyledTableRow hover role="checkbox" tabIndex={-1} key={index} >
                                        
                                                    <StyledTableCell component="th" scope="row" >{enseignant.grade}</StyledTableCell>
                                                    <StyledTableCell >{enseignant.lastName}</StyledTableCell>
                                                    <StyledTableCell >{enseignant.name}</StyledTableCell>
                                                    <StyledTableCell >{enseignant.email}</StyledTableCell>
                                                    <StyledTableCell >
                                                        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-evenly"}}>
                                                            <IconButton sx={{border: "1px solid #005c75", boxShadow:" 2px 2px 5px rgba(0, 0, 0, .3)"}}
                                                                onClick={()=>goTo(`/admin/editEnseignant/${enseignant.userId}`)}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton sx={{border: "1px solid #005c75", boxShadow:" 2px 2px 5px rgba(0, 0, 0, .3)"}}
                                                                onClick={()=>deleteEnseignant(enseignant.userId)}
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
                                count={enseignants.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                </div>

            </div>
        </div>

    </div>
  )
}

export default ListEnseignants;
