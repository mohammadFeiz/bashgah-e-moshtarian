import React,{Component,createContext} from "react";
import RVD from 'react-virtual-dom';
import getSvg from './getSvg';
import Slider from 'r-range-slider';
import AIOButton from './components/aio-button/aio-button';
import pic1 from './images/1425783 1.png';
import services from './services';
import "./style.css";
let ClubContext = createContext();
export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeBottomMenu:2,
      gems:0,
      history:[],
      details:[],
      poorsant:0,
      score:0,
      awards:[],
      awardSorts:[
        {text:'محبوب ترین',value:'0'},
        {text:'جدید ترین',value:'1'},
        {text:'الماس از کم به زیاد',value:'2'},
        {text:'الماس از زیاد به کم',value:'3'}
      ],
      activeAwardSort:'0',
      krs:[],
      catchedAwards:[],
      user:{
        name:'کوروش شجاعی'
      }
    }
  }
  async getGems(){
    let {tokenParsed} = this.props;
    let gems = await services('gems',{tokenParsed});
    this.setState({gems})
  }
  async getHistory(){
    let {tokenParsed} = this.props;
    let history = await services('history',{tokenParsed});
    this.setState({history})
  }
  async getDetails(){
    let {tokenParsed} = this.props;
    let details = await services('details',{tokenParsed});
    this.setState({details})
  }
  async getPoorsant(){
    let {tokenParsed} = this.props;
    let poorsant = await services('poorsant',{tokenParsed});
    this.setState({poorsant})
  }
  async getScore(){
    let {tokenParsed} = this.props;
    let score = await services('score',{tokenParsed});
    this.setState({score})
  }
  async getAwards(activeAwardSort = '0'){
    let {tokenParsed} = this.props;
    let awards = await services('awards',{activeAwardSort,tokenParsed});
    this.setState({awards})
  }
  async getCatchedAwards(){
    let {tokenParsed} = this.props;
    let catchedAwards = await services('catchedAwards',{tokenParsed});
    this.setState({catchedAwards})
  }
  async getKRs(){
    let {tokenParsed} = this.props;
    let krs = await services('KRS',{tokenParsed});
    this.setState({krs})
  }
  async componentDidMount(){
     this.getGems();
     this.getPoorsant();
     this.getScore();
     this.getDetails();
     this.getAwards();
  }
  getContent(){
    let {activeBottomMenu:a} = this.state;
    if(a === 0){return <Awards/>}
    if(a === 1){return <KRS/>}
    if(a === 2){return <Home/>}
    if(a === 3){return <History/>}
  }
  async changeBottomMenu(id){
    this.setState({activeBottomMenu:id});
    this.getGems();
  }
  getContext(){
    return {
      ...this.state,
      logout:this.props.logout,
      getAwards:this.getAwards.bind(this),
      getHistory:this.getHistory.bind(this),
      getScore:this.getScore.bind(this),
      getCatchedAwards:this.getCatchedAwards.bind(this),
      getKRs:this.getKRs.bind(this),
      SetState:(obj)=>this.setState(obj),
      changeAwardSort:async (activeAwardSort)=>{
        await this.getAwards(activeAwardSort);
        this.setState({activeAwardSort});
      }
    }
  }
  render(){
    let {activeBottomMenu} = this.state;
    return (
      <ClubContext.Provider value={this.getContext()}>
        <RVD
        layout={{
          className:'app',
          column:[
            {flex:1,html:this.getContent()},
            layout('bottomMenu',{activeBottomMenu,onChange:(id)=>this.changeBottomMenu(id)})
          ]
        }}
      />
      </ClubContext.Provider>
    );
  }
}
class Home extends Component{
  static contextType = ClubContext;
  state = {
    openAwards:false,maxScore:300000,showDetails:false,activeAwardTab:'0',showAward:false,
    tabs:[
      'همه','کالا','خدمات','تخفیف'
    ]
  }
  card(){
    let {showDetails} = this.state;
    let {user,poorsant,score,homeCardDetails = {}} = this.context;
    // let homeCardDetails = {
    //   type:'برنزی',

    // }
      return {
      size:202,
      className:'home-card margin-0-12',
      attrs:{onClick:()=>this.setState({showDetails:!showDetails})},
      column:[
        {
          flex:1,
          row:[
            {
              flex:1,
              column:[
                {size:20},
                {
                  size:28,
                  row:[{size:20},{className:'home-card-circle'},{size:6},{html:user.name,className:'home-card-name',align:'v'}]
                },
                {size:16},
                {
                  show:false,row:[
                    {size:20},{size:28,html:getSvg('cash'),align:'vh'},{size:6},
                    {html:'پورسانت هفتگی من',className:'home-card-poorsant-title bold',align:'v'},{size:6},
                    {html:poorsant + ' تومان',className:'home-card-poorsant-value bold',align:'v'},
                  ]
                }
              ]
            },
            {
              size:120,align:'h',
              column:[
                {html:homeCardDetails.type,className:'home-card-label',align:'vh'},
                {html:'',className:'home-card-label-arrow'},
                {html:getSvg('bronze'),align:'vh'}
              ]
            }
          ]
        },
        {
          size:48,
          row:[
            {size:20},
            {className:'home-card-score',html:score + ' امتیاز'},
            {
              flex:1,
              html:(
                <Slider
                  attrs={{style:{padding:'0 24px',paddingBottom:24}}}
                  start={0} end={300} scaleStep={100} labelStep={100}
                  scaleStyle={()=>{return {width:12,height:12,zIndex:100,borderRadius:'100%',transform:'translate(-6px,-6px)'}}}
                  editLabel={(value)=>{
                    if(value === 100){return 75000}
                    if(value === 200){return 150000}
                    if(value === 300){return 300000}
                    return value
                  }}
                  labelStyle={()=>{return {color:'#fff',fontSize:10,top:30}}}
                  points={[score / 1000]}
                  fillStyle={(index)=>{
                    if(index !== 0){return}
                    return {height:3,background:'#006F9E'}
                  }}
                  pointStyle={()=>{return {display:'none'}}}
                  lineStyle={()=>{return {background:'#fff',height:5}}}
                />
              )
            },
            {size:24}
          ]
        },
      ]
    }
  }
  
  tabs(){
    let {tabs,activeAwardTab} = this.state;
    return {
      row:[
        {flex:1},
        {
          gap:6,
          row:tabs.map((o,i)=>{
            let index = i.toString();
            return this.tab({text:o,id:index,active:activeAwardTab === index,onClick:()=>this.setState({activeAwardTab:index})})
          })
        },
        {flex:1}
      ]
    }
  }
  tab({text,active,onClick}){
    return {
      size:60,className:'home-tab' + (active?' active':''),align:'vh',
      html:text,
      attrs:{onClick:()=>onClick()}
    }
  }
  awardsHandle(){
    let {openAwards} = this.state;
    return {
      html:<div className='home-awards-handle'></div>,
      align:'vh',size:36,className:'home-awards-header',
      attrs:{onClick:()=>this.setState({openAwards:!openAwards})}
    }
  }
  awardsSort(){
    let {awardSorts,activeAwardSort,changeAwardSort} = this.context;
    return {
      size:36,childsProps:{align:'v'},className:'margin-0-12 color383A39 bold size14',
      row:[
        {html:awardSorts[activeAwardSort].text},
        {flex:1},
        {
          html:(
            <AIOButton 
              mode='bottom-popover'
              popupHeader={'دسته بندی بر اساس'}
              activeAwardSort={activeAwardSort}
              text={getSvg('sort')} type='select'
              optionChecked='option.value === this.props.activeAwardSort'
              options={awardSorts}
              onChange={(activeAwardSort)=>changeAwardSort(activeAwardSort)}
            />
          )
        }]
    }
  }
  awardsCards(){
    let {awards} = this.context;
    return {
      flex:1,className:'home-award-cards',
      column:awards.map((o)=>this.awardCard(o))
    }
  }
  awardCard(o){
    let {title,text,score} = o;
    return {
      className:'home-award-card',attrs:{onClick:()=>this.setState({showAward:o})},
      column:[
        {flex:1,html:<img src={pic1} alt="" width='100%'/>},
        {
          flex:1,className:'home-award-card-footer',
          column:[
            {html:title,align:'v',className:'padding-8 bold size12'},
            {html:text,flex:1,className:'padding-8 bold color605E5C size10'},
            {
              childsProps:{align:'v'},className:'padding-8',
              row:[{flex:1},{html:score},{html:getSvg('gem2')}]
            } 
          ]
        }
      ]
    }
  }
  detailsCards(){
    let {details} = this.context;
    return {
      gap:12,scroll:'v',flex:1,className:'home-details-cards',
      column:details.map(({title,text,max,value,mileStones,labelStep,affix})=>{
        return {
          className:'home-detail-card margin-0-12',
          column:[
            {html:title,className:'size16 bold color005478 padding-12'},
            {flex:1,html:text,className:'size10 color005478 padding-0-12'},
            {
              html:(
                <Slider 
                  pointStyle={()=>{return {background:'none'}}}
                  getPointHTML={()=>{
                    return getSvg('spark')
                  }}
                  start={0}
                  end={max}
                  points={[value]}
                  fillStyle={(index)=>{return {height:3,background:index === 0?'#006F9E':'none'}}}
                  labelStep={labelStep}
                  scaleStep={labelStep}
                  scaleStyle={(val)=>{
                    let index = mileStones.indexOf(val);
                    if(index === -1){return {display:'none'}}
                  }}
                  labelStyle={()=>{return {top:6,color:'#fff'}}}
                  editLabel={(value)=>mileStones.indexOf(value) === -1?'':value + ' ' + affix}

                />
              )
            }
          ]

        }
      })
    }
  }
  awardsLabel(){
    return {html:'لیست جوایز',size:36,align:'v',className:'size14 colorfff margin-0-12'}
  }
  header(){
    return {align:'v',className:'margin-0-12',row:[{html:getSvg('burux')},{flex:1},{html:22567,className:'home-score'},{html:getSvg('gem1')}]}
  }
  awards(){
    return {
      flex:1,
      column:[
        this.awardsLabel(),
        this.tabs(),
        {
          flex:1,
          className:'home-awards',
          column:[
            this.awardsHandle(),
            this.awardsSort(),
            this.awardsCards()
          ]
        }
      ]
    }
  }
  async getAward(){
    let {tokenParsed} = this.context;
    services('getAward',{award:this.state.showAward,tokenParsed})
    this.setState({showAward:false})
  }
  award(){
    let {showAward} = this.state;
    let {title,score,description,howToUse,rules} = showAward;
    return {
      style:{background:'#fff'},flex:1,scroll:'v',
      column:[
        {size:161,html:'تصویر',align:'vh'},
        {size:36,html:title,className:'size14 bold padding-0-24',align:'v'},
        {
          size:36,className:'padding-0-24',
          row:[
            {html:score,className:'size10 bold',align:'v'},
            {size:5},
            {html:'الماس',className:'size10 bold',align:'v'},
            {size:5},
            {html:getSvg('gem3'),className:'size10 bold',align:'v'},
            {size:5},
            {html:'مورد نیاز',className:'size10',align:'v'}
          ]
        },
        {size:36,html:<div style={{height:2,width:'100%',background:'#ddd'}}></div>,align:'v'},
        {size:36,html:'توضیحات و مشخصات :',className:'size14 bold padding-0-24',align:'v'},
        {size:36,html:description,className:'size12 padding-0-24',align:'v'},
        {size:36,html:<div style={{height:2,width:'100%',background:'#ddd'}}></div>,align:'v'},
        {size:36,html:'نحوه استفاده :',className:'size14 bold padding-0-24',align:'v'},
        {size:36,html:howToUse,className:'size12 padding-0-24',align:'v'},
        {size:36,html:<div style={{height:2,width:'100%',background:'#ddd'}}></div>,align:'v'},
        {size:36,html:'قوانین و مقررات :',className:'size14 bold padding-0-24',align:'v'},
        {size:36,html:rules,className:'size12 padding-0-24',align:'v'},
        {size:36,html:<div style={{height:2,width:'100%',background:'#ddd'}}></div>,align:'v'},
        {html:<button style={{background:'#0094D4',color:'#fff',height:45,border:'none',padding:'0 36px',borderRadius:4,fontFamily:'inherit'}}
        onClick={()=>this.getAward()}>دریافت جایزه</button>,align:'vh'}
        
        
      ]
    }
  }
  async componentDidMount(){
    this.context.getScore();
    this.context.getAwards();
  }
  render(){
    let {showDetails,openAwards,showAward} = this.state;
    let {logout} = this.context;
    return (
      <RVD
        layout={{
          className:'page',
          column:[
            layout('header',{gems:this.context.gems,logout}),
            {size:12},
            openAwards || showAward?false:this.card(),
            showDetails || showAward?false:this.awards(),
            !showDetails || showAward?false:this.detailsCards(),
            !showAward?false:this.award()
          ]
        }}
      />
    )
  }
}
class History extends Component{
  static contextType = ClubContext;
  card({date,gem = 0,score = 0,title}){
    return {
      style:{borderBottom:'1px solid #ddd',minHeight:96,background:'#fff'},
      row:[
        {size:12},
        {
          flex:1,
          column:[
            {flex:1},
            {size:36,html:title,align:'v',className:'size14 bold'},
            {size:36,html:'تاریخ : ' + date,align:'v'},
            {flex:1}
          ]
        },
        {
          align:'v',
          column:[
            {
              size:36,show:gem !== 0,
              childsProps:{align:'vh'},
              row:[
                {size:24,html:gem,className:'size16 bold ' + (gem < 0?'colorA4262C':'color107C10')},
                {size:24,html:getSvg(gem > 0?'arrowUp':'arrowDown')},
                {size:24,html:getSvg('gem2')}
              ]
            },
            {
              size:36,show:score !== 0,
              childsProps:{align:'vh'},
              row:[
                {size:24,html:score,className:'size16 bold ' + (score < 0?'colorA4262C':'color107C10')},
                {size:24,html:getSvg(score > 0?'arrowUp':'arrowDown')},
                {size:24,html:getSvg('star')}
              ]
            }
          ]
        },
        {size:12}
      ]
    }
  }
  async componentDidMount(){
    this.context.getHistory();
    this.context.getPoorsant();
  }
  render(){
    let {history} = this.context;
    return (
      <RVD
        layout={{
          className:'page',
          column:[
            layout('header',{gems:this.context.gems}),
            layout('titr',{text:'تاریخچه'}),
            {
              flex:1,scroll:'v',
              column:history.map((o)=>{
                return this.card(o)
              })
            }
          ]
        }}
      />
    )
  }
}
class Awards extends Component{
  static contextType = ClubContext;
  cards(){
    let {catchedAwards} = this.context;
    return {
      flex:1,scroll:'v',className:'padding-12',gap:12,column:catchedAwards.map((o)=>this.card(o)),style:{background:'#F1F2F3'}
    }
  }
  getStatusText(id){
    let colors = ['#FFDAB8','#CFFFB8']
    return <div style={{background:colors[id],padding:3,borderRadius:4}} className='bold size12'>{['در حال بررسی','در انتظار استفاده'][id]}</div>
  }
  card({title,payedGems,status}){
    return {
      style:{background:'#fff',borderRadius:3},
      column:[
        {
          flex:1,
          className:'padding-12',
          row:[
            {size:120,html:<img src={pic1} alt="" width='100%'/>,align:'vh'},
            {size:6},
            {
              childsProps:{align:'v'},flex:1,
              column:[
                {size:24,html:title,className:'size12 bold'},
                {size:24,html:payedGems + ' الماس پرداخت شده',className:'size10'},
                {size:24,row:[{flex:1,html:'وضعیت سفارش: '},{html:this.getStatusText(status)}],className:'size10'},
              ]
            }
          ]
        },
        {
          size:36,align:'vh',html:'مشاهده جزییات',className:'size10 color10BABE',
          style:{borderTop:'1px dashed #ddd'}
        }
      ]
    }
  }
  async componentDidMount(){
    this.context.getCatchedAwards();
  }
  render(){
    return (
      <RVD
        layout={{
          className:'page',
          column:[
            layout('header',{gems:this.context.gems}),
            layout('titr',{text:'جوایز دریافتی'}),
            this.cards()
          ]
        }}
      />
    )
  }
}
class KRS extends Component{
  static contextType = ClubContext;
  cards(){
    let {krs} = this.context;
    return {
      flex:1,scroll:'v',className:'padding-12',gap:12,column:krs.map((o)=>this.card(o)),style:{background:'#F1F2F3'}
    }
  }
  card({title,text,score,start,end,value,points,affix}){
    return {
      column:[
        {
          style:{background:'#fff',borderRadius:12},
          size:54,
          row:[
            {
              size:160,
              html:(
                <div style={{position:'relative'}}>
                  {getSvg('krBG')}
                  <span style={{position:'absolute',right:24,top:19,fontSize:14,color:'#fff',fontWeight:'bold'}}>{title}</span>
                </div>
              )
            },
            {flex:1},
            {html:text,align:'v',className:'color005478 bold size14'},
            {size:24}
          ]
        },
        {
          size:48,
          row:[
            {html:'روند دریافت امتیاز :',className:'size14 bold',align:'v'},
            {flex:1},
            {html:'جزِییات',className:'color2BA4D8 bold size12',align:'v'}
          ]
        },
        {
          size:60,
          row:[
            {html:'امتیاز شما از این شاخص: ' + score + ' امتیاز',className:'color004578 size12',align:'v'},
            {flex:1},
            {size:36,html:<div style={{background:'#FFB500',width:8,height:8,borderRadius:'100%'}}></div>,align:'vh'},
            {html:'موقعیت شما',align:'v',className:'size12'},
            {size:36,html:<div style={{background:'#005478',width:8,height:8,borderRadius:'100%'}}></div>,align:'vh'},
            {html:'دفعات خرید',align:'v',className:'size12'}
          ]
        },
        {size:60,html:(
              <Slider
                attrs={{style:{padding:'0 36px',paddingTop:20}}}
                pointStyle={()=>{return {background:'orange'}}}
                start={start} end={end} points={[value]}
                scaleStep={points}
                labelStep={points}
                labelStyle={()=>{return {top:-5,color:'#005478',fontSize:14}}}
                editLabel={(value)=>value + ' ' + affix}
                scaleStyle={()=>{
                  return {
                    width:12,height:12,transform:'translate(-6px,-6px)',borderRadius:'100%',background:'#005478',zIndex:100
                  }
                }}
                lineStyle={()=>{return {background:'#2BA4D8',height:4}}}
              />
            )}

      ]
    }
  }
  async componentDidMount(){
    this.context.getKRs();
  }
  render(){
    return (
      <RVD
        layout={{
          className:'page',
          column:[
            layout('header',{gems:this.context.gems}),
            layout('titr',{text:'شاخص ها'}),
            this.cards()
          ]
        }}
      />
    )
  }
}
function layout(type,parameters = {}){
  let $$ = {
    header(){
      let {gems = 22567,logout = ()=>{}} = parameters;
      return {
        column:[
          {size:48},
          {
            align:'v',className:'margin-0-12',
            row:[
              {html:getSvg('burux'),attrs:{onClick:()=>logout()}},
              {flex:1},
              {html:gems,className:'header-score'},{html:getSvg('gem1')}]
          }
        ]
      }
    },
    bottomMenu(){
      let {activeBottomMenu = 2,onChange} = parameters;
      return {
        size:88,align:'vh',
        className:'app-footer',
        html:(
          <RVD
            layout={{
              className:'bottom-menu',align:'v',
              childsProps:{align:'vh',size:48},
              childsAttrs:({id})=>{
                let className = 'bottom-menu-item';
                if(id === activeBottomMenu){className += ' active'}
                return {className,onClick:()=>onChange(id)}
              },
              row:[
                {html:getSvg('gift'),id:0},
                {html:getSvg('bars'),id:1},
                {html:getSvg('home'),id:2},
                {html:getSvg('history'),id:3},
                {html:getSvg('question'),id:4},
              ]
            }}
          />
        )
      }
    },
    titr(){
      let {text} = parameters;
      return {size:48,html:text,className:'padding-0-12 size14 bold titr',align:'v'}
    }
    
    
  }
  return $$[type]()
}

