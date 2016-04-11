--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: restaurant; Type: TABLE; Schema: public; Owner: scott; Tablespace: 
--

CREATE TABLE restaurant (
    id integer NOT NULL,
    name character varying(100),
    url character varying(100),
    email character varying(100),
    phonenumber character varying(16),
    address character varying(200)
);


ALTER TABLE restaurant OWNER TO scott;

--
-- Name: restaurant_id_seq; Type: SEQUENCE; Schema: public; Owner: scott
--

CREATE SEQUENCE restaurant_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE restaurant_id_seq OWNER TO scott;

--
-- Name: restaurant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scott
--

ALTER SEQUENCE restaurant_id_seq OWNED BY restaurant.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scott
--

ALTER TABLE ONLY restaurant ALTER COLUMN id SET DEFAULT nextval('restaurant_id_seq'::regclass);


--
-- Data for Name: restaurant; Type: TABLE DATA; Schema: public; Owner: scott
--

COPY restaurant (id, name, url, email, phonenumber, address) FROM stdin;
1	Antioch College	http://www.antiochcollege.org			dining halls
2	Corner Kitchen	http://www.afinerdiner.com			613 E. 5th St., Dayton, OH 45403
3	Harvest Mobile Food Truck	http://www.harvestmobilecuisine.com	Pat@harvestmobilecuisine.com	(937) 475-7423	
4	La Pampa Catering	https://www.marianorios.wordpress.com	gitanorios77@gmail.com	(937) 767-1649	
5	Lily's Bistro	http://www.lilysbistro.com			329 E. 5th St., Dayton, OH 45402
6	Lucky’s Taproom and Eatery	http://www.luckystaproom.com			520 E. 5th St., Dayton, OH 45402
7	The Meadowlark Restaurant	http://meadowlarkrestaurant.com			5531 Far Hills Ave., Dayton, OH 45429
8	Rue Dumaine Restaurant	http://www.ruedumainerestaurant.com			1061 Miamisburg Centerville Rd., Dayton, OH 45459
10	The Shakery Juice Bar	http://www.theshakeryjuicebar.com	theshakeryjuicebar@gmail.com	(937) 938-0540	
11	Sunrise Cafe	http://www.sunrisecafe-ys.com			259 Xenia Ave., Yellow Springs, OH 45387
12	Wheat Penny Oven and Bar	http://www.wheatpennydayton.com			515 Wayne Ave., Dayton, OH 45410
13	Winds Cafe	http://www.windscafe.com			215 Xenia Ave., Yellow Springs, OH 45387
9	Seasons Bistro and Grille	http://www.seasonsbistroandgrille.com			28 S. Limestone St., Springfield, OH 45502
\.


--
-- Name: restaurant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scott
--

SELECT pg_catalog.setval('restaurant_id_seq', 13, true);


--
-- Name: restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: scott; Tablespace: 
--

ALTER TABLE ONLY restaurant
    ADD CONSTRAINT restaurant_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

