{
  'targets': [
    {
      'target_name': 'blsct',
      'include_dirs': [
         '../../navcoin/src/bls/include',
         '../../navcoin/src/bls/mcl/include',
         '../../navcoin/src',
      ],
      'libraries': [
        '../../lib/libblsct.a',
        '../../lib/libbls384_256.a',
        '../../lib/libmcl.a',
      ],
      'sources': [
        'blsct_wrap.cxx',
      ],
      'cflags': [
        '-std=c++20',
      ],
      'cflags_cc': [
        '-std=c++20'
      ],
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ]
    }
  ]
}
