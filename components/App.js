App = React.createClass({

    getInitialState() {
        return {
            loading: false,
            searchingText: '',
            gif: {}
        };
    },

    // promises

    handleSearch: function(searchingText) {  // 1.
      this.setState({
        loading: true  // 2.
      });

// moja propozycja

      this.getGif(searchingText)
        .then ( gif => 
            {
              this.setState({  // 4
                loading: false,  // a
                gif: gif,  // b
                searchingText: searchingText  // c
                }).bind(this);
            }
        )
        .catch(Txt => console.log(Txt));

// ~~~~~~~~~~~~~~^
/*
      this.getGif(searchingText, function(gif) {  // 3.
        this.setState({  // 4
          loading: false,  // a
          gif: gif,  // b
          searchingText: searchingText  // c
        });
      }.bind(this));
*/
    },

      getGif: function(searchingText, callback) {  // 1.
        return new Promise( // start
          function (resolve, reject) {        
        
        var url = 'https://api.giphy.com' + '/v1/gifs/random?api_key=' + 'zjkEQrqw4Nd5MZUAQzkuVPrMdGReDgqm' + '&tag=' + searchingText;  // 2.
        var xhr = new XMLHttpRequest();  // 3.
        xhr.open('GET', url);
        xhr.onload = function() {
          // musimy je umieścić wewnątrz obsługi naszego zapytania AJAX
          // Resolve zamiast callback'a... a reject, jeżeli status będzie inny niż 200

            if (xhr.status === 200) {
               var data = JSON.parse(xhr.responseText).data; // 4.
                var gif = {  // 5.
                    url: data.fixed_width_downsampled_url,
                    sourceUrl: data.url
                };
                //callback(gif);  // 6.
                resolve(gif);
            } else {
              var Txt = "błędy"
                reject(Txt);
            }
        };
        xhr.send();

        // resolve(result); //spełnienie obietnicy
        // reject(error); //niespełnienie obietnicy
      }); // koniec promisa
    },

    render: function() {

        var styles = {
            margin: '0 auto',
            textAlign: 'center',
            width: '90%'
        };

        return (
          <div style={styles}>
                <h1>Wyszukiwarka GIFow!</h1>
                <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
                <Search onSearch={this.handleSearch}/>
                <Gif
                    loading={this.state.loading}
                    url={this.state.gif.url}
                    sourceUrl={this.state.gif.sourceUrl}
                />
          </div>
        );
    }
});