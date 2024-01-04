import { useEffect, useState } from 'react';
import Head from 'next/head'
import { subscribe } from "react-contextual";
import styles from '@/styles/home.module.scss'
import { FaEllipsisH, FaBell, FaQuestion } from 'react-icons/fa';
import { useSession, useSettings } from '@/_shared/hooks';
import topCharities from '@/_shared/data/top-charities.json';
import { favoriteCharities, listCharities } from '@/_shared/libs/api';

import Image from 'next/image'
//import headerImage from './../'

import {
    Document,
    Button,
    Paper,
    Form,
    Box,
    Section,
    Grid,
    PageHeader,
    Card,
    Modal,
    List,
    Layouts,
    Tooltip,
    Dropdown,
    Label,
    Charts,
    Table,
    Stat,
    Charities as Charity,
    DashboardTables,
    Pages
} from '@/_shared/ui';

import TestGeocode from '@/_shared/ui/charities/test-geocode'

/**
 * Responsible for displaying grant data, charity data,
 * and previous grants from a specific account.
 */
const Charities = (props) => {

    // Several states to keep track of.
    const [modalOpen, setModalOpen] = useState(false);
    const { session, sessionLoading } = useSession(props, { require: true });
    const { settings, settingsLoading } = useSettings(props, 'dashboard');
    const [favorites, setFavorites] = useState(false);
    const [favoritesLoading, setFavoritesLoading] = useState(false);
    const [favoritesString, setFavoritesString] = useState('');
    const [searchCharityList, setSearchCharityList] = useState(props.charities);
    const [searchCharitySelected, setSearchCharitySelected] = useState(undefined);

    const retrieveFavorites = async () => {
        setFavoritesLoading(true);
        const res = await favoriteCharities();

        if (res !== false) {
            setFavoritesString(res);
            setFavorites(await listCharities(res));
        }

        setFavoritesLoading(false);
    }

    useEffect(() => {
        if (!favorites) {
            retrieveFavorites();
        }
    }, []);

    // Set the header of the page
    const header = (
        <Document.Header title="Charities" />
    );

    // If the session is loading, only render the head
    if (sessionLoading || !sessionLoading && !session || settingsLoading) {
        return header
    }

    if (props.settings.data.grants_enabled === false) {
        return (
            <>
                {header}
                <Layouts.Dashboard>
                    <Pages.Disabled />
                </Layouts.Dashboard>
            </>
        )
    }

    return (
        <>
            {header}
            <Layouts.Dashboard>
                <Section>
                   {/*  <Grid.Row>
                        <Grid.Col m={12} t={4} d={4}>
                            <Box
                                paper={true}
                                title="Grant Summary"
                                padding={0}
                            >
                                <Stat spaced={true} title="Current Balance" value={`$${props.session.data.account ? props.session.data.account.totalBalance.toFixed(2) : 0.00}`} />
                                <Stat spaced={true} title="Amount Granted This Year" value={`$${props.session.data.account ? props.session.data.account.year.grantsTotal.toFixed(2) : 0.00}`} />
                            </Box>


                        </Grid.Col>



                        <Grid.Col m={12} t={4} d={4}>
                            <Box
                                paper={true}
                                title="Top Charities"
                                padding={0}
                                contentHeight={245}
                            >
                                <Charity.List charities={props.charities} onClick={charity => {
                                    setSearchCharityList(props.charities);
                                    setSearchCharitySelected(charity);
                                    setModalOpen(true);
                                }} />
                            </Box>
                        </Grid.Col>
                    </Grid.Row>
 */}

{/* 
<Grid.Row>
                        <Grid.Col m={12} t={12} d={12}>

                            <Box
                                paper={true}
                                title="Favourite Charities"
                                padding={0}
                            >

                            <Charity.Favorites
                                status={'open' }
                                onGranted={() => setModalOpen(false)}
                                openSnackbar={props.openSnackbar}
                                onFavoritesChange={retrieveFavorites}
                                favorites={favoritesString}
                                charities={searchCharityList}
                                selected={searchCharitySelected}
                                defaultCharities={props.charities}
                            />

                            </Box>

                        </Grid.Col>
                    </Grid.Row> */}



<Grid.Row >
                        <Grid.Col className="p-0" m={12} t={12} d={12}>

                            <Box
                                                         
                                padding={0}
                                
                            >


                {/* <TestGeocode/> */}
                <div
                style={{
                    height: "133px",
                   
                }}
                className={styles.imageParent}>
                <Image objectFit="cover" src={'/assets/images/charity-header.png'} height="133px" width="1356px"/>
                 </div>
                <span className={styles.Charities}>
                        CHARITIES
                        </span>
                

                
              
                
                

                            <Charity.Search
                                status={'open' }
                                onGranted={() => setModalOpen(false)}
                                openSnackbar={props.openSnackbar}
                                onFavoritesChange={retrieveFavorites}
                                favorites={favoritesString}
                                charities={searchCharityList}
                                selected={searchCharitySelected}
                                defaultCharities={props.charities}
                            />

                            </Box>

                        </Grid.Col>
                    </Grid.Row>


                </Section>
             </Layouts.Dashboard>
        </>
    )
}

export async function getStaticProps() {

    return {
        props: {
            charities: topCharities.data,
        },
    }
}

export default subscribe()(Charities);
