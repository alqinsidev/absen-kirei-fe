import {
  Alert,
  Box,
  Container,
  Typography,
  Grid,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../../redux/hook";
import AbsenService from "../../services/absenService";
import SocketIO from "../../services/socketIO";
let scanTimer: ReturnType<typeof setTimeout>;

function QrScanner() {
  const qrRef = useRef<HTMLInputElement>(null);
  const Auth = useAppSelector((state) => state.auth);

  const [token, setToken] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [presences, setPresences] = useState<any>(null);

  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.focus();
    }
  }, []);

  useEffect(() => {
    SocketIO.on("qr-scanner", handleScanResult);
    getPresence();
  }, []);

  const getPresence = async () => {
    try {
      const res = await AbsenService.getTodayPresence();
      setPresences(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleScanResult = (result: any) => {
    if (result.meta) {
      if (result.meta.is_success) {
        setUser(result.data.user.full_name);
        getPresence();
        setTimeout(() => setUser(""), 10000);
      } else {
        setErrorMessage(result.data.error);
        setIsError(true);
        setTimeout(() => setIsError(false), 3000);
      }
    }
    setToken("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    clearTimeout(scanTimer);
    setToken(e.target.value);
    scanTimer = setTimeout(() => {
      SocketIO.emit("qr-scanner", {
        token: e.target.value,
        access_token: Auth.access_token,
      });
    }, 500);
    // scanTimer = setTimeout(() => {
    //   storePresence(e.target.value)
    //     .then((res) => {
    //       setUser(res.user.full_name);
    //       setTimeout(() => setUser(""), 10000);
    //     })
    //     .catch((err) => {
    //       setErrorMessage(err.response.data.message);
    //       setIsError(true);
    //     })
    //     .finally(() => {
    //       setToken("");
    //     });
    // }, 500);
  };

  // const storePresence = async (input: string) => {
  //   try {
  //     const res = await AbsenService.storePresence({ token: input });
  //     return res.data.data;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // };
  return (
    <Container
      maxWidth="md"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="h5">ABSENSI KIREI</Typography>
            <Typography>Silahkan scan QR anda</Typography>
            <input
              type="text"
              ref={qrRef}
              onChange={handleChange}
              value={token}
              style={{ opacity: 0.01, position: "absolute" }}
            />
            {isError && (
              <Alert severity="error" sx={{ marginTop: 2 }}>
                {errorMessage}
              </Alert>
            )}
            {/* <Typography>{date.toString()}</Typography> */}
            {user !== "" && (
              <Alert sx={{ marginTop: 5 }}>{user.toUpperCase()}</Alert>
            )}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Nama</TableCell>
                  <TableCell>Jam Absen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {presences &&
                  presences.map((item: any, index: number) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.user.full_name}</TableCell>
                      <TableCell>
                        {moment(item.created_at).format("HH:mm")} WIB
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
}

export default QrScanner;
