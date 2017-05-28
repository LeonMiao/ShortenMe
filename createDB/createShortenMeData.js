db = db.getSiblingDB('shortenme_db')
db.createCollection('accounts')
accountsCollection = db.getCollection("accounts")
accountsCollection.remove({})
accountsCollection.insert(
{
	accountId: 1,
    userName: "firstTestUser",
		fName: "Herbert",
    mName: "A.",
    lName: "Cazarez",
    emailAddr: "hac@msn.com",
    phoneNum: "800-100-2001",
    userType: "Basic",
    createDate: "5-1-2017"
}
)

accountsCollection.insert(
{
	accountId: 2,
    userName: "secondTestUser",
		fName: "Robin",
    mName: "S.",
    lName: "Redwine",
    emailAddr: "rsr@hotmail.com",
    phoneNum: "600-200-5002",
    userType: "Pro",
    createDate: "5-2-2017"
}
)

accountsCollection.insert(
{
	accountId: 3,
    userName: "thirdTestUser",
		fName: "James",
    mName: "L.",
    lName: "Nichols",
    emailAddr: "rsr@hotmail.com",
    phoneNum: "520-030-7003",
    userType: "Basic",
    createDate: "5-3-2017"
}
)

db.createCollection('urls')
urlsCollection = db.getCollection("urls")
urlsCollection.remove({})
urlsCollection.insert(
{
	accountId : 1,
	urls : [
	 {
	   urlId: 1,
	   shortUrl: "shortUrl#1",
	   longUrl: "longUrl #1",
	   expirationDate: "6-15-2017",
	   isRemoved: false
	 },
	 {
	   urlId: 2,
	   shortUrl: "shortUrl#2",
	   longUrl: "longUrl #2",
	   expirationDate: "6-15-2017",
	   isRemoved: false
	 },
	 {
	   urlId: 3,
	   shortUrl: "shortUrl#3",
	   longUrl: "longUrl #3",
	   expirationDate: "6-15-2017",
	   isRemoved: false
	 }
	]
}
)

urlsCollection.insert(
{
	accountId : 2,
	urls : [
	 {
	   urlId: 1,
	   shortUrl: "shortUrl#4",
	   longUrl: "longUrl #4",
	   expirationDate: "6-15-2017",
	   isRemoved: false
	 },
	 {
	   urlId: 2,
	   shortUrl: "shortUrl#5",
	   longUrl: "longUrl #5",
	   expirationDate: "6-15-2017",
	   isRemoved: false
	 },
	 {
	   urlId: 3,
	   shortUrl: "shortUrl#6",
	   longUrl: "longUrl #6",
	   expirationDate: "6-15-2017",
	   isRemoved: false
	 }
	]
}
)

urlsCollection.insert(
{
	accountId : 3,
	urls : [
	 {
	   urlId: 1,
	   shortUrl: "shortUrl#7",
	   longUrl: "longUrl #7",
	   expirationDate: "6-15-2017",
	   isRemoved: false
	 },
	 {
	   urlId: 2,
	   shortUrl: "shortUrl#8",
	   longUrl: "longUrl #8",
	   expirationDate: "6-15-2017",
	   isRemoved: false
	 },
	 {
	   urlId: 3,
	   shortUrl: "shortUrl#9",
	   longUrl: "longUrl #9",
	   expirationDate: "6-15-2017",
	   isRemoved: false
	 }
	]
}
)

