import React, {useState, useEffect} from 'react'
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Slider from "@material-ui/core/Slider";
import Backdrop from "@material-ui/core/Backdrop";
import clsx from "clsx"
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import IconButton from "@material-ui/core/IconButton";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const logo = require('./icon.png');

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const LengthSlider = withStyles({
  root: {
    color: '#3880ff',
    height: 2,
    padding: '15px 0',
  },
  thumb: {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    marginTop: -14,
    marginLeft: -14,
    '&:focus, &:hover, &$active': {
      boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 12px)',
    top: -22,
    '& *': {
      background: 'transparent',
      color: '#000',
    },
  },
  track: {
    height: 2,
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  mark: {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    marginTop: -3,
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor',
  },
})(Slider);
  
  const useStyles = makeStyles((theme) => ({
    root: {
      height: "200vh",
    },
    image: {
      backgroundRepeat: "no-repeat",
      backgroundColor:
        theme.palette.type === "light"
          ? theme.palette.grey[50]
          : theme.palette.grey[900],
      backgroundSize: "cover",
      backgroundPosition: "fill",
      height: "71.6%",
    },
    paper: {
      margin: theme.spacing(8, 4),
      height: "15%"
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", 
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
      width: "100%"
      // width: '25ch',
    },
    slider: {
      marginTop: "60px",
      width: "100%",
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
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
      width: "100%"
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

    const model = {
        serious: {
          name: "AristoBot",
          image_search: ['inspiration', 'motivation', 'life-lesson', 'love', 'hope', 'friendship', 'life', 'faith', 'universe', 'nature'],
        }
    };

    const keys = [];
    for (var k in model){
      keys.push(k)
    }
    const classes = useStyles();
    const [modelName, setModelName] = React.useState(
        keys[Math.floor(Math.random() * keys.length)]
    );
    const [nextSeed, setNextSeed] = React.useState(" ");
    const [genSeed, setGenSeed] = React.useState("");
    const [bgImage, setBgImage] = useState("")
    const [quote, setQuote] = useState("")
    const [author, setAuthor] = useState("")
    const [minLength, setMinLength] = React.useState(10);
    const [maxLength, setMaxLength] = React.useState(50);
    const [modelLoading, setModelLoading] = React.useState(false);
    const [loadingSeed, setLoadingSeed] = React.useState(false);
    const [generatingQuote, setGeneratingQuote] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleSubmit = (event) => {
      setGeneratingQuote(true)
      setLoadingSeed(true);
      getRandomImage();  
      setQuote("");
        setAuthor("");
        axios
          .get("https://quotify-engine-l6lhxur2aq-uc.a.run.app/generate/" + nextSeed + "/" + minLength + "/" + maxLength + "/0.5"
          )
          .then(function (response) {
            console.log("Response in submit: " + response["data"]["output"]);
            setQuote(response["data"]["output"]);
            setAuthor("Quotify");
            setGeneratingQuote(false);
          })
          .catch((error) => {
            console.log(error);
            setQuote("Uh Oh! Something's wrong. Please come back later");
            setAuthor("Quotify");
            setGeneratingQuote(false);
          });
          setLoadingSeed(false);
          setGeneratingQuote(false)
        event.preventDefault();
    }

    const getRandomImage = () => {
        axios
          .get(unsplashApi, {
            params: {
              query:
                model["serious"]["image_search"][
                  Math.floor(
                    Math.random() * model["serious"]["image_search"].length 
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
        setLoadingSeed(true)
        getRandomImage();
        axios
          .get("https://quotify-engine-l6lhxur2aq-uc.a.run.app/generate/" + nextSeed + "/" + minLength + "/" + maxLength + "/0.5/")
              .then(function (response) {
                setQuote(response["data"]["output"]);
                setAuthor("Quotify");
                setGeneratingQuote(false);
                setLoadingSeed(false);
              })
              .catch((error) => {
                console.log(error);
                setQuote("Uh Oh! Something's wrong. Please come back later");
                setGenSeed("");
                setAuthor("Quotify");
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

      const handleOpen = () => {
        setOpen(!open);
      };

      const handleSeedChange = (event) => {
        setNextSeed(event.target.value);
      };

      return (
        <Grid container component="main" style = {{flexWrap:"wrap", width: "100%", height:"100vh"}} justify= 'space-around' direction = "column" alignItems="stretch">
        <CssBaseline />
        <Grid
          item
          container
          direction="column"
          justify="center"
          alignItems="stretch"
          position="relative"
          className={classes.image}
          style={{ backgroundImage: "url(" + bgImage + ")" }}
        >
          <section>
            <div class="quote" style = {{textAlign: "center", alignItems:"center", backgroundColor:"black", opacity:"0.6"}}>
              <hr class="line" />
              {generatingQuote ? (
                <div>
                  <Typography
                    style={{ marginLeft: "10px", color: "white" }}
                    // variant="overline"
                  >
                    Generating quote...
                  </Typography>
                  <CircularProgress
                    color="secondary"
                    className={classes.progressModel}
                  />
                </div>
              ) : (
                <p class="text" style={{opacity:"100%", color:"white", fontSize: "36px" }}>{quote}</p>
              )}
              <p class="attr" style={{alignText: "right",  color:"white", fontSize: "30px"}}>- Quotify</p>
              {/* <hr class="line" /> */}
            </div>
          </section>
        </Grid>
        <Grid item 
        className={classes.paper}
        >
          <Backdrop className={classes.backdrop} open={modelLoading}>
            <Typography variant="overline">Fetching {modelName}...</Typography>
            <LinearProgress className={classes.progressModel} color="primary" />
          </Backdrop>
          <div >
            <img src={logo}  alt="Quotify"/>
            <div style ={{"display": "flex", width:"100%"}}>
              
            <form className={classes.form} noValidate onSubmit={handleSubmit}> 
            <FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
                <InputLabel htmlFor="seed" style={{fontSize:"20px", marginLeft: "1%", marginTop: "1%"}}>
                  Leave a phrase and let Quotify blow your mind
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
              <FormControl fullWidth>
                
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
                      <LengthSlider 
                      id = 'min-length'
                      aria-label="Minimum Number of Words" 
                      onChange={handleMinLength} 
                      value={minLength}
                      valueLabelDisplay="on" 
                      step={10}
                      marks
                      min={10}
                      max={100}/>
                    </FormControl>
                    <br/>
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
                      <LengthSlider
                        id="max-length"
                        aria-label="Maximum Number of Words"
                        value={maxLength}
                        onChange={handleMaxLength}
                        step={10}
                        marks
                        min={10}
                        max={100}
                        valueLabelDisplay="on"
                      />
                    </FormControl>
              </FormControl>
              <FormControl fullWidth 
              // className={clsx(classes.margin)}
              >
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
           </div>
        </Grid>
      </Grid>
    ); 
}

export default QuoteGenerator;