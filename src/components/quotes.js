import React, {useState, useEffect} from 'react'
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Slider from "@material-ui/core/Slider";
import Backdrop from "@material-ui/core/Backdrop";
import clsx from "clsx"
import SettingsIcon from "@material-ui/icons/Settings";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";
import Radio from "@material-ui/core/Radio";
import { green } from "@material-ui/core/colors";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import IconButton from "@material-ui/core/IconButton";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles, withStyles } from "@material-ui/core/styles";


const api = "https://fastapi-quote-l6lhxur2aq-uc.a.run.app/"
const LargeTooltip = withStyles((theme) => ({
    tooltip: {
      //   backgroundColor: theme.palette.common.white,
      //   color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 14,
    },
  }))(Tooltip);
  
  const useStyles = makeStyles((theme) => ({
    root: {
      height: "100vh",
    },
    image: {
      backgroundRepeat: "no-repeat",
      backgroundColor:
        theme.palette.type === "light"
          ? theme.palette.grey[50]
          : theme.palette.grey[900],
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(5),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    margin: {
      margin: theme.spacing(1),
    },
    formControl: {
      width: "100%",
    },
    textField: {
      // width: '25ch',
    },
    slider: {
      marginTop: "60px",
      width: "90%",
      // boxSizing: "border-box",
    },
    sliderLabel: {
      marginTop: "5px",
    },
    buttonProgress: {
      color: green[500],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
    starRating: {
      position: "absolute",
      top: "85%",
      background: ":rgba(0,0,0,0.6)",
      borderRadius: "5px",
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    progressModel: {
      width: "50%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  }));

  const headers = {
    'Content-Type': 'text/plain'
};

function QuoteGenerator() {
    const unsplashApi = "https://api.unsplash.com/photos/random";

    const persona = {
        serious: {
          name: "AristoBot",
          description:
            "I am a wise old fool who ponders about Philosophy, Religion, Life and Death to uncover deep truths of the universe.",
          image_search: ["universe", "life", "philosophy"],
        }
    };

    const keys = [];
    for (var k in persona){
      keys.push(k)
    }
    const classes = useStyles();
    const [modelName, setModelName] = React.useState(
        keys[Math.floor(Math.random() * keys.length)]
    );
    const [nextSeed, setNextSeed] = React.useState("");
    const [genSeed, setGenSeed] = React.useState("");
    const [bgImage, setBgImage] = useState("")
    const [quote, setQuote] = useState("")
    const [author, setAuthor] = useState("")
    const [minLength, setMinLength] = React.useState(10);
    const [maxLength, setMaxLength] = React.useState(100);
    const [modelLoading, setModelLoading] = React.useState(false);
    const [loadingSeed, setLoadingSeed] = React.useState(false);
    const [generatingQuote, setGeneratingQuote] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleSubmit = (event) => {
      setLoadingSeed(true);
      getRandomImage();  
      setQuote("");
        setAuthor("");
        axios
          .get("https://fastapi-quoter2-l6lhxur2aq-uc.a.run.app/gen/" + nextSeed, {
              start_text: nextSeed
            }
          )
          .then(function (response) {
            console.log("Response in submit: " + response["data"]["output"]);
            setQuote(response["data"]["output"]);
            setAuthor(persona[modelName]["name"]);
            setGeneratingQuote(false);
          })
          .catch((error) => {
            console.log(error.response);
            setQuote("Uh Oh! Something's wrong. Please come back later");
            setAuthor("Quote Father");
            setGeneratingQuote(false);
          });
          setLoadingSeed(false);
        event.preventDefault();
    }
    const getRandomImage = () => {
        axios
          .get(unsplashApi, {
            params: {
              query:
                persona[modelName]["image_search"][
                  Math.floor(
                    Math.random() * persona[modelName]["image_search"].length
                  )
                ],
              featured: true,
              orientation: "landscape",
              client_id: "kyQ0zryeRGFsjyO7FynKyjAaHEArYN4HivqKKNKwQGU",
            }
          })
          .then(function (response) {
            console.log(response);
            setBgImage(response["data"]["urls"]["regular"]);
          })
          .catch((error) => {
            console.log(error.response);
            setBgImage("https://source.unsplash.com/random");
          });
      };

      useEffect(() => {
        setGeneratingQuote(true);
        getRandomImage();
            axios
              .get("https://fastapi-quoter2-l6lhxur2aq-uc.a.run.app/gen/" + nextSeed, {
                  start_text: ""
              })
              .then(function (response) {
                setQuote(response["data"]["output"]);
                setAuthor(persona[modelName]["name"]);
                setGeneratingQuote(false);
                setLoadingSeed(false);
              })
              .catch((error) => {
                console.log(error);
                setQuote("Uh Oh! Something's wrong. Please come back later");
                setGenSeed("");
                setAuthor("AI Bot");
                setGeneratingQuote(false);
                setLoadingSeed(false);
              });
          }, [])

      const handleMinLength = (event, newValue) => {
        setMinLength(newValue);
      };
    
      const handleMaxLength = (event, newValue) => {
        setMaxLength(newValue);
      };

      const handleSeedChange = (event) => {
        setNextSeed(event.target.value);
      };

      return (
        <Grid container component="main" className={classes.root}>
        <CssBaseline />
        {/* style={{background: "#f5f5f5"}} */}
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Backdrop className={classes.backdrop} open={modelLoading}>
            <Typography variant="overline">Fetching {modelName}...</Typography>
            <LinearProgress className={classes.progressModel} color="primary" />
          </Backdrop>
          <div className={classes.paper}>
            <img src="../logo.png" style={{ width: "60%" }} alt="AI Quotes Generator"/>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <Grid container justify="center">
                <FormControl variant="outlined" className={classes.formControl}>
                  <FormLabel component="legend">Select the Persona</FormLabel>
                  <RadioGroup
                    row
                    aria-label="position"
                    name="position"
                    value={modelName}
                    // onChange={handleModelNameChange}
                  >
                    <LargeTooltip
                      title={persona["serious"]["description"]}
                      placement="top"
                    >
                      <FormControlLabel
                        value="serious"
                        control={<Radio color="primary" />}
                        label={persona["serious"]["name"]}
                        labelPlacement="end"
                      />
                    </LargeTooltip>
                    {/* <LargeTooltip
                      title={persona["serious"]["description"]}
                      placement="top"
                    >
                      <FormControlLabel
                        value="serious"
                        control={<Radio color="primary" />}
                        label={persona["serious"]["name"]}
                        labelPlacement="end"
                      />
                    </LargeTooltip>
                    <LargeTooltip
                      title={persona["funny"]["description"]}
                      placement="top"
                    >
                      <FormControlLabel
                        value="funny"
                        control={<Radio color="primary" />}
                        label={persona["funny"]["name"]}
                        labelPlacement="end"
                      />
                    </LargeTooltip> */}
                  </RadioGroup>
                </FormControl>
              </Grid>
              <FormControl
                fullWidth
                className={clsx(classes.margin, classes.textField)}
              >
                <InputLabel htmlFor="seed" style={{ marginLeft: "2%" }}>
                  Start off the quote or leave it empty to go completely random
                </InputLabel>
                <OutlinedInput
                  id="seed"
                  type="text"
                  value={nextSeed}
                  onChange={handleSeedChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="shuffle"
                        color="primary"
                        onClick={handleSubmit}
                      >
                        {loadingSeed ? (
                          <CircularProgress size={30} />
                        ) : (
                          <ShuffleIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl fullWidth className={clsx(classes.margin)}>
                <List>
                  <ListItem button>
                    <ListItemIcon>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Advanced Settings" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    
                    {/* <FormControl className={clsx(classes.margin, classes.slider)}>
                      <InputLabel
                        htmlFor="variety"
                        className={clsx(classes.sliderLabel)}
                      >
                        Variety
                      </InputLabel>
                      <Slider
                        id="variety"
                        value={variety}
                        onChange={handleVariety}
                        step={0.1}
                        marks
                        min={0.1}
                        max={0.9}
                        valueLabelDisplay="on"
                      />
                    </FormControl> */}
                    <FormControl
                      fullWidth
                      className={clsx(classes.margin, classes.slider)}
                    >
                      <InputLabel
                        htmlFor="min-length"
                        className={clsx(classes.sliderLabel)}
                      >
                        Minimum Number of Words
                      </InputLabel>
                      <Slider
                        id="min-length"
                        value={minLength}
                        onChange={handleMinLength}
                        step={10}
                        marks
                        min={10}
                        max={100}
                        valueLabelDisplay="on"
                      />
                    </FormControl>
                    <FormControl
                      fullWidth
                      className={clsx(classes.margin, classes.slider)}
                    >
                      <InputLabel
                        htmlFor="max-length"
                        className={clsx(classes.sliderLabel)}
                      >
                        Maximum Number of Words
                      </InputLabel>
                      <Slider
                        id="max-length"
                        value={maxLength}
                        onChange={handleMaxLength}
                        step={10}
                        marks
                        min={10}
                        max={100}
                        valueLabelDisplay="on"
                      />
                    </FormControl>
                  </Collapse>
                </List>
              </FormControl>
              <FormControl fullWidth className={clsx(classes.margin)}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={generatingQuote}
                  className={classes.submit}
                >
                  Generate Quote
                </Button>
                {generatingQuote && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </FormControl>
            </form>
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={7}
          className={classes.image}
          style={{ backgroundImage: "url(" + bgImage + ")" }}
        >
          <section>
            {/* <div class="line"></div> */}
  
            <div class="quote">
              <hr class="line" />
              {generatingQuote ? (
                <div>
                  <Typography
                    style={{ marginLeft: "10px", color: "white" }}
                    variant="overline"
                  >
                    Writing the quote...
                  </Typography>
                  <LinearProgress
                    color="secondary"
                    style={{ width: "100%" }}
                    className={classes.progressModel}
                  />
                </div>
              ) : (
                <p class="text">{quote}</p>
              )}
              <p class="attr">{author}</p>
              <hr class="line" />
            </div>
          </section>
        </Grid>
      </Grid>
    ); 
}

export default QuoteGenerator;