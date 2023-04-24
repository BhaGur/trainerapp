import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';


export default function Editcustomer(props) {
    const [open, setOpen] = React.useState(false);
    const[customer, setCustomer] = React.useState({
        firstname: '',
        lastname: '',
        streetaddress: '',
        postcode: '',
        city: '',
        email: '',
        phone: ''
    });

    const handleClickOpen = () => {
        setCustomer({
            firstname: props.params.firstname,
            lastname: props.params.lastname,
            streetaddress: props.params.streetaddress,
            postcode: props.params.postcode,
            city: props.params.city,
            email: props.params.email,
            phone: props.params.phone
        })
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        props.updateCustomer(customer, props.params.links[0].href);
        setOpen(false);
    };

    return(
        <div>
            <Button startIcon = {<EditIcon />} color="primary" onClick={handleClickOpen}>
                
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Update Customer</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        value={customer.firstname}
                        onChange={e => setCustomer({...customer, firstname: e.target.value})}
                        label="First Name"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        value={customer.lastname}
                        onChange={e => setCustomer({...customer, lastname: e.target.value})}
                        label="Lastname"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        value={customer.streetaddress}
                        onChange={e => setCustomer({...customer, streetaddress:e.target.value})}
                        label="Street address"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        value={customer.postcode}
                        onChange={e => setCustomer({...customer, postcode: e.target.value})}
                        label="Postcode"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        value={customer.city}
                        onChange={e => setCustomer({...customer, city: e.target.value})}
                        label="City"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        value={customer.email}
                        onChange={e => setCustomer({...customer, email: e.target.value})}
                        label="Email"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        value={customer.phone}
                        onChange={e => setCustomer({...customer, phone: e.target.value})}
                        label="Phone"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}