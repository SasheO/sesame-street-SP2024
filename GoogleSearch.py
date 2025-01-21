from flask import Flask, render_template, request
from googlesearch import search
app = Flask(__name__)

@app.route("/", methods = ["GET", "POST"])
def search_query():
    if request.method == "POST":
        query = request.form.get("query")
        # return "\n".join(list(search(query)))
        return render_template("GoogleResults.html", results=list(search(query)))
    else:
        return render_template("GoogleSearch.html")

if __name__ == "__main__":
    app.run()