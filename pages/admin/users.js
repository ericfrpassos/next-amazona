import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer } from 'react';
import {
  CircularProgress,
  Typography,
  Grid,
  List,
  ListItem,
  Card,
  Button,
  ListItemText,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@material-ui/core';

import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';
import Layout from '../../components/Layout';
import useStyles from '../../utils/styles';
import { useSnackbar } from 'notistack';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, error: '' };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, error: action.payload };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}

function AdminUsers() {
  const { state } = useContext(Store);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  const [{ loading, loadingDelete, successDelete, error, users }, dispatch] =
    useReducer(reducer, {
      loading: true,
      users: [],
      error: '',
    });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/admin/users', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        enqueueSnackbar(getError(err), { variant: 'error' });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (userId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }

    try {
      dispatch({ type: 'DELETE_REQUEST' });
      const { data } = await axios.delete(`/api/admin/users/${userId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELETE_SUCCESS', payload: data });
      enqueueSnackbar(data.message, { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title={`Users`}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Products"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Users"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Users
                </Typography>
              </ListItem>
              {loading || loadingDelete ? (
                <ListItem className={classes.alignItemsAndJustifyContent}>
                  <CircularProgress />
                </ListItem>
              ) : error ? (
                <ListItem>
                  <Typography className={classes.error}>{error}</Typography>
                </ListItem>
              ) : (
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>NAME</TableCell>
                          <TableCell>EMAIL</TableCell>
                          <TableCell>ISADMIN</TableCell>
                          <TableCell>ACTIONS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>{user._id.substring(20, 24)}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>$ {user.email}</TableCell>
                            <TableCell>{user.isAdmin ? 'YES' : 'NO'}</TableCell>
                            <TableCell>
                              <NextLink href={`user/${user._id}`} passHref>
                                <Button size="small" variant="contained">
                                  Edit
                                </Button>
                              </NextLink>{' '}
                              <Button
                                onClick={() => deleteHandler(user._id)}
                                size="small"
                                variant="contained"
                                disabled={user.isAdmin}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminUsers), { ssr: false });
