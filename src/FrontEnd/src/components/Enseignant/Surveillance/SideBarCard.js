import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StudentsList from './StudentsList';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: "auto",
  marginRight: "10px",
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function SideBarCard({student}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{backgroundColor: "#024773", color: "white", display:"grid",borderRadius:"0",boxShadow:"0 2px 2px rgba(0,0,0,.3)", padding:"1px", gridTemplateColumns: "1fr 3fr 1fr", gridTemplateRows: "1fr" }}>
      
        
        <Avatar sx={{ bgcolor: red[500], marginBlock: "auto",marginLeft:"10px", textTransform:"uppercase" }} aria-label="recipe">
            {student.etudiant.lastName.charAt(0) + student.etudiant.name.charAt(0)}
        </Avatar>
        <p style={{marginInline: "auto", height:"100%"}} >{student.etudiant.lastName + " " + student.etudiant.name}</p>
        <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            sx={{marginLeft: "auto", marginRight: "10px"}}
        >
            <ExpandMoreIcon sx={{fill:"white"}}/>
        </ExpandMore>
      
      <Collapse in={expanded} sx={{gridColumn:"span 3"}} timeout="auto" unmountOnExit>
            <CardContent>
                <p>frist name: {student.etudiant.lastName}</p>
                <p>Last name: {student.etudiant.name}</p>
                <p>Card number: {student.etudiant.cardNumber}</p>
            </CardContent>
      </Collapse>
    </Card>
    )
};

